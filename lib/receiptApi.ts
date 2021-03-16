import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as cognito from "@aws-cdk/aws-cognito";
import * as appsync from "@aws-cdk/aws-appsync";
import * as lambda from "@aws-cdk/aws-lambda";
import * as ddb from "@aws-cdk/aws-dynamodb";
import { DynamoEventSource } from "@aws-cdk/aws-lambda-event-sources";
import { MappingTemplate } from "@aws-cdk/aws-appsync";

type Props = {
  receiptBucket: s3.Bucket;
  receiptTable: ddb.Table;
  userPool: cognito.UserPool;
};

export class ReceiptApi extends cdk.Construct {
  api: appsync.GraphqlApi;

  constructor(
    scope: cdk.Construct,
    id: string,
    { receiptBucket, receiptTable, userPool }: Props
  ) {
    super(scope, id);

    this.api = new appsync.GraphqlApi(this, "paragoneApp", {
      name: "paragoneApi",
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
      schema: appsync.Schema.fromAsset("./graphql/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
          },
        },
        additionalAuthorizationModes: [
          { authorizationType: appsync.AuthorizationType.API_KEY },
        ],
      },
    });

    // Query getUploadUrlHandler
    const getUploadUrlHandler = new lambda.Function(
      this,
      "getUploadUrlHandler",
      {
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: `index.getUploadUrlHandler`,
        code: lambda.Code.fromAsset("lambda"),
        environment: {
          BUCKET_NAME: receiptBucket.bucketName,
        },
        memorySize: 1024,
      }
    );

    receiptBucket.grantPut(getUploadUrlHandler);
    this.api
      .addLambdaDataSource("getUploadUrlDataSource", getUploadUrlHandler)
      .createResolver({ typeName: "Query", fieldName: "getUploadUrl" });

    // Query getDownloadUrlHandler
    const getDownloadUrlHandler = new lambda.Function(
      this,
      "getDownloadUrlHandler",
      {
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: `index.getDownloadUrlHandler`,
        code: lambda.Code.fromAsset("lambda"),
        environment: {
          BUCKET_NAME: receiptBucket.bucketName,
        },
        memorySize: 1024,
      }
    );

    receiptBucket.grantRead(getDownloadUrlHandler);
    this.api
      .addLambdaDataSource("getDownloadUrlDataSource", getDownloadUrlHandler)
      .createResolver({ typeName: "Query", fieldName: "getDownloadUrl" });

    // Query receipts
    const getReceiptsHandler = new lambda.Function(this, "getReceiptsHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: `index.getReceiptsHandler`,
      code: lambda.Code.fromAsset("lambda"),
      environment: {
        TABLE_NAME: receiptTable.tableName,
      },
    });

    receiptTable.grant(getReceiptsHandler, "dynamodb:Query");
    this.api
      .addLambdaDataSource("receiptsDataSource", getReceiptsHandler)
      .createResolver({ typeName: "Query", fieldName: "receipts" });

    // Mutation receiptProcessed
    const receiptProcessedHandler = new lambda.Function(
      this,
      "receiptProcessedHandler",
      {
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: `index.receiptProcessedHandler`,
        code: lambda.Code.fromAsset("lambda"),
        environment: {
          API_KEY: this.api.apiKey || "",
          GRAPHQL_URL: this.api.graphqlUrl,
        },
        memorySize: 1024,
      }
    );

    receiptProcessedHandler.addEventSource(
      new DynamoEventSource(receiptTable, {
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        batchSize: 1,
      })
    );

    this.api.addNoneDataSource("receiptProcessedDataSource").createResolver({
      typeName: "Mutation",
      fieldName: "receiptProcessed",
      requestMappingTemplate: MappingTemplate.fromString(`
        {
          "version": "2017-02-28",
          "payload": {
            "id": "\${ctx.arguments.id}",
            "price": "\${ctx.arguments.price}",
            "username": "\${ctx.arguments.username}",
            "createdAt": "\${ctx.arguments.createdAt}",
          }
        }
      `),
      responseMappingTemplate: MappingTemplate.fromString(
        `\$util.toJson(\$ctx.result)`
      ),
    });

    // Subscription onReceiptProcessed
    this.api.addNoneDataSource("onReceiptProcessedDataSource").createResolver({
      typeName: "Subscription",
      fieldName: "onReceiptProcessed",
      requestMappingTemplate: MappingTemplate.fromString(`
        {
          "version": "2017-02-28",
          "payload": {
            "username": "\${ctx.arguments.username}",
          }
        }
      `),
      responseMappingTemplate: MappingTemplate.fromString(`
        #if(\${context.identity.username} != \${context.arguments.username})
            $utils.unauthorized()
        #else
        ##User is authorized, but we return null to continue
            null
        #end
      `),
    });
  }
}
