import * as AWS from "aws-sdk";
import { S3CreateEvent } from "aws-lambda";

const textract = new AWS.Textract();

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "";
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN || "";
const SNS_ROLE_ARN = process.env.SNS_ROLE_ARN || "";

export const handler = async (event: S3CreateEvent) => {
  const filename = event.Records[0].s3.object.key;

  const params: AWS.Textract.StartDocumentAnalysisRequest = {
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

  await textract.startDocumentAnalysis(params).promise();
  // .then(data => {data.JobId})
};