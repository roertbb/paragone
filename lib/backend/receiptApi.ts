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

    this.api = new appsync.GraphqlApi(this, "paragoneApi", {
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
        handler: `getUploadUrl.handler`,
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
        handler: `getDownloadUrl.handler`,
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
    this.api
      .addDynamoDbDataSource("receiptsHandler", receiptTable)
      .createResolver({
        typeName: "Query",
        fieldName: "receipts",
        requestMappingTemplate: MappingTemplate.fromFile(
          "lib/backend/mappingTemplates/receipts.request.vtl"
        ),
        responseMappingTemplate: MappingTemplate.fromFile(
          "lib/backend/mappingTemplates/receipts.response.vtl"
        ),
      });

    // Mutation receiptProcessed
    const receiptProcessedHandler = new lambda.Function(
      this,
      "receiptProcessedHandler",
      {
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: `receiptProcessed.handler`,
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
      requestMappingTemplate: MappingTemplate.fromFile(
        "lib/backend/mappingTemplates/receiptProcessed.request.vtl"
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        "lib/backend/mappingTemplates/receiptProcessed.response.vtl"
      ),
    });

    // Subscription onReceiptProcessed
    this.api.addNoneDataSource("onReceiptProcessedDataSource").createResolver({
      typeName: "Subscription",
      fieldName: "onReceiptProcessed",
      requestMappingTemplate: MappingTemplate.fromFile(
        "lib/backend/mappingTemplates/onReceiptProcessed.request.vtl"
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        "lib/backend/mappingTemplates/onReceiptProcessed.response.vtl"
      ),
    });
  }
}
