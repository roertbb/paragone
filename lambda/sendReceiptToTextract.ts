import { Textract, DynamoDB } from "aws-sdk";
import { S3CreateEvent } from "aws-lambda";

const TableName = process.env.TABLE_NAME!;
const textract = new Textract();
const db = new DynamoDB.DocumentClient();

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "";
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN || "";
const SNS_ROLE_ARN = process.env.SNS_ROLE_ARN || "";

export const handler = async (event: S3CreateEvent) => {
  const filename = event.Records[0].s3.object.key;
  const [username, id] = filename.split("/");

  const params: Textract.StartDocumentAnalysisRequest = {
    DocumentLocation: {
      S3Object: {
        Bucket: S3_BUCKET_NAME,
        Name: filename,
      },
    },
    FeatureTypes: ["FORMS"],
    NotificationChannel: {
      RoleArn: SNS_ROLE_ARN,
      SNSTopicArn: SNS_TOPIC_ARN,
    },
  };

  const Item = {
    id,
    username,
    createdAt: new Date().valueOf(),
  };

  try {
    await Promise.all([
      db.put({ TableName, Item }).promise(),
      textract.startDocumentAnalysis(params).promise(),
    ]);
  } catch (error) {
    console.error({ error });
  }
};
