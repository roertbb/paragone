import { DynamoDB, Textract } from "aws-sdk";
import { SNSEvent } from "aws-lambda";

const textract = new Textract({ region: "eu-central-1" });
const TableName = process.env.TABLE_NAME!;
const db = new DynamoDB.DocumentClient();

const priceRegex = /\d+([.,]\d{1,2})?/g;
const currency = "PLN";

function extractPrice(data: Textract.GetDocumentAnalysisResponse) {
  const lines =
    data.Blocks?.filter(({ BlockType }) => BlockType === "LINE") || [];

  const linesWithCurrency = [] as Textract.Block[];
  for (let i = 0; i < lines?.length; i++) {
    if (lines[i].Text?.includes(currency)) {
      linesWithCurrency.push(lines[i]);
      if (i + 1 < lines.length) {
        linesWithCurrency.push(lines[i + 1]);
      }
    }
  }

  const extractedPrices = linesWithCurrency
    ?.map(({ Text }) => Text?.match(priceRegex)?.[0])
    .filter(Boolean)
    .map((price) => price?.replace(",", "."));

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
    const [username, id] = filename.split("/");

    await db
      .update({
        TableName,
        Key: {
          id,
          username,
        },
        UpdateExpression: "set price = :p, processedAt = :t",
        ExpressionAttributeValues: {
          ":p": price ? Number(price) : undefined,
          ":t": new Date().valueOf(),
        },
      })
      .promise();
  } catch (error) {
    console.log({ error });
  }
};
