import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import * as sns from "@aws-cdk/aws-sns";
import {
  S3EventSource,
  SnsEventSource,
} from "@aws-cdk/aws-lambda-event-sources";

type Props = {
  receiptBucket: s3.Bucket;
  receiptTable: ddb.Table;
};

export class ReceiptProcessor extends cdk.Construct {
  constructor(
    scope: cdk.Construct,
    id: string,
    { receiptBucket, receiptTable }: Props
  ) {
    super(scope, id);

    const snsReceiptProcessedTopic = new sns.Topic(
      this,
      "ReceiptProcessedTopic"
    );

    const textractServiceRole = new iam.Role(this, "TextractServiceRole", {
      assumedBy: new iam.ServicePrincipal("textract.amazonaws.com"),
    });

    const policyStatement = new iam.PolicyStatement();
    policyStatement.addActions("*");
    policyStatement.addResources("*");
    textractServiceRole.addToPolicy(policyStatement);

    snsReceiptProcessedTopic.grantPublish(textractServiceRole);

    const sendReceiptToTextract = new lambda.Function(
      this,
      "sendReceiptToTextract",
      {
        code: lambda.Code.fromAsset("lambda"),
        handler: "index.sendReceiptToTextract",
        runtime: lambda.Runtime.NODEJS_12_X,
        environment: {
          S3_BUCKET_NAME: receiptBucket.bucketName,
          SNS_TOPIC_ARN: snsReceiptProcessedTopic.topicArn,
          SNS_ROLE_ARN: textractServiceRole.roleArn,
        },
        memorySize: 1024,
      }
    );

    sendReceiptToTextract.addEventSource(
      new S3EventSource(receiptBucket, {
        events: [s3.EventType.OBJECT_CREATED],
      })
    );

    sendReceiptToTextract.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["textract:*"],
        resources: ["*"],
      })
    );

    snsReceiptProcessedTopic.grantPublish(sendReceiptToTextract);
    receiptBucket.grantReadWrite(sendReceiptToTextract);

    const sendTextractResultToDynamo = new lambda.Function(
      this,
      "sendTextractResultToDynamo",
      {
        code: lambda.Code.fromAsset("lambda"),
        handler: "index.sendTextractResultToDynamo",
        runtime: lambda.Runtime.NODEJS_12_X,
        environment: {
          SNS_TOPIC_ARN: snsReceiptProcessedTopic.topicArn,
          SNS_ROLE_ARN: textractServiceRole.roleArn,
          TABLE_NAME: receiptTable.tableName,
        },
        memorySize: 1024,
      }
    );

    sendTextractResultToDynamo.addEventSource(
      new SnsEventSource(snsReceiptProcessedTopic)
    );
    sendTextractResultToDynamo.addToRolePolicy(policyStatement);
    receiptTable.grantWriteData(sendTextractResultToDynamo);
  }
}
