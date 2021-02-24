import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as cognito from "@aws-cdk/aws-cognito";
import * as appsync from "@aws-cdk/aws-appsync";
import * as lambda from "@aws-cdk/aws-lambda";
import * as ddb from "@aws-cdk/aws-dynamodb";
import { ReceiptProcessor } from "./receiptProcessor";

export class ParagoneStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const receiptBucket = new s3.Bucket(this, "receiptBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      cors: [
        {
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT],
          maxAge: 3000,
        },
      ],
    });

    const receiptTable = new ddb.Table(this, "receiptTable", {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });

    new ReceiptProcessor(this, "receiptProcessor", {
      receiptBucket,
      receiptTable,
    });

    const userPool = new cognito.UserPool(this, "paragoneUserPool", {
      selfSignUpEnabled: true,
      accountRecovery: cognito.AccountRecovery.PHONE_AND_EMAIL,
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.CODE,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
    });

    const userPoolClient = new cognito.UserPoolClient(
      this,
      "paragoneUserPoolClient",
      {
        userPool,
      }
    );

    const api = new appsync.GraphqlApi(this, "paragoneApp", {
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
    api
      .addLambdaDataSource("getUploadUrlDataSource", getUploadUrlHandler)
      .createResolver({ typeName: "Query", fieldName: "getUploadUrl" });
  }
}
