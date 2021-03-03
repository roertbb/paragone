import fetch from "node-fetch";
import { DynamoDBStreamEvent } from "aws-lambda";
import { StreamRecord } from "aws-sdk/clients/dynamodbstreams";

const API_KEY = process.env.API_KEY || "";
const GRAPHQL_URL = process.env.GRAPHQL_URL || "";

const receiptProcessedMutation = `
  mutation ReceiptProcessed(
    $filename: String!
    $price: Float
    $username: String!
  ) {
    receiptProcessed(username: $username, filename: $filename, price: $price) {
      username,
      filename,
      price
    }
  }
`;

async function notifyReceiptProcessed({
  data,
}: {
  data: StreamRecord["NewImage"];
}) {
  const mutation = {
    query: receiptProcessedMutation,
    operationName: "ReceiptProcessed",
    variables: {
      username: data?.username.S,
      filename: data?.filename.S,
      price: Number(data?.price.N),
    },
  };

  try {
    await fetch(GRAPHQL_URL, {
      method: "POST",
      body: JSON.stringify(mutation),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
    }).then((res: any) => res.json());
  } catch (error) {
    console.error(error, JSON.stringify(error));
  }
}

export const handler = async (event: DynamoDBStreamEvent) => {
  if (!API_KEY) {
    return { message: "Could not load the API Key" };
  }

  for (const record of event.Records) {
    if (record.eventName === "INSERT") {
      const data = record.dynamodb?.NewImage;

      await notifyReceiptProcessed({ data });
    } else {
      console.log("some other event", JSON.stringify(event, null, 2));
    }
  }

  return { message: `Finished processing ${event.Records.length} records` };
};
