import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as cognito from "@aws-cdk/aws-cognito";
import * as appsync from "@aws-cdk/aws-appsync";
import * as lambda from "@aws-cdk/aws-lambda";
import * as ddb from "@aws-cdk/aws-dynamodb";

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
    { receiptBucket, userPool }: Props
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
      },
    });

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
      }
    );

    receiptBucket.grantPut(getUploadUrlHandler);
    this.api
      .addLambdaDataSource("getUploadUrlDataSource", getUploadUrlHandler)
      .createResolver({ typeName: "Query", fieldName: "getUploadUrl" });
  }
}
