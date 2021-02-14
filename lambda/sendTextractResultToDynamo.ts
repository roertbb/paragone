import * as AWS from "aws-sdk";
import { SNSEvent } from "aws-lambda";

const textract = new AWS.Textract({ region: "eu-central-1" });

const priceRegex = /\d+([.,]\d{1,2})?/g;
const currency = "PLN";

function extractPrice(data: AWS.Textract.GetDocumentAnalysisResponse) {
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

  let JobId;
  try {
    const msg = JSON.parse(Message);
    JobId = msg["JobId"];
  } catch (error) {
    console.log(error);
    return;
  }

  const params: AWS.Textract.GetDocumentAnalysisRequest = {
    JobId,
  };

  await textract
    .getDocumentAnalysis(params)
    .promise()
    .then((data) => {
      const price = extractPrice(data);

      // save to dynamodb
      console.log(price);
    })
    .catch(({ error }) => console.log(error));
};
