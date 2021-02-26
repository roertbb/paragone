import { DynamoDB, Textract } from "aws-sdk";
import { SNSEvent } from "aws-lambda";

const textract = new Textract({ region: "eu-central-1" });
const TableName = process.env.TABLE_NAME!;
const db = new DynamoDB.DocumentClient();

const priceRegex = /\d+([.,]\d{1,2})?/g;
const currency = "PLN";

function extractPrice(data: Textract.GetDocumentAnalysisResponse) {
  const lines = data.Blocks?.filter(({ BlockType }) => BlockType === "LINE");
  const linesWithCurrency = lines?.filter(({ Text }) =>
    Text?.includes(currency)
  );
  const extractedPrices = linesWithCurrency
    ?.map(({ Text }) => Text?.match(priceRegex)?.[0])
    .filter(Boolean);

  return extractedPrices?.[0];
}

export const handler = async (event: SNSEvent) => {
  const { Message } = event.Records[0].Sns;

  let JobId: string;
  let filename: string;

  try {
    const msg = JSON.parse(Message);
    JobId = msg.JobId;
    filename = msg.DocumentLocation.S3ObjectName;
  } catch (error) {
    console.log(error);
    return;
  }

  const params: Textract.GetDocumentAnalysisRequest = { JobId };

  try {
    const data = await textract.getDocumentAnalysis(params).promise();

    const price = extractPrice(data);
    const username = filename.split("_")[0];

    await db
      .update({
        TableName,
        Key: {
          filename,
          username,
        },
        UpdateExpression: "set price = :p",
        ExpressionAttributeValues: {
          ":p": price,
        },
      })
      .promise();
  } catch (error) {
    console.log({ error });
  }
};
