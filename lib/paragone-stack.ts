import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as cognito from "@aws-cdk/aws-cognito";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as appsync from "@aws-cdk/aws-appsync";
import { ReceiptProcessor } from "./receiptProcessor";
import { ReceiptApi } from "./receiptApi";

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
        name: "username",
        type: ddb.AttributeType.STRING,
      },
      sortKey: {
        name: "filename",
        type: ddb.AttributeType.STRING,
      },
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

    new ReceiptProcessor(this, "receiptProcessor", {
      receiptBucket,
      receiptTable,
    });

    const { api } = new ReceiptApi(this, "receiptApi", {
      receiptBucket,
      receiptTable,
      userPool,
    });

    new cdk.CfnOutput(this, "Region", {
      value: this.region,
    });

    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, "ClientId", {
      value: userPoolClient.userPoolClientId,
    });

    new cdk.CfnOutput(this, "GraphQLEndpoint", {
      value: api.graphqlUrl,
    });

    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    });

    new cdk.CfnOutput(this, "GraphQLAuthenticationType", {
      value: appsync.AuthorizationType.USER_POOL,
    });
  }
}
