import fetch from "node-fetch";
import { DynamoDBStreamEvent } from "aws-lambda";
import { StreamRecord } from "aws-sdk/clients/dynamodbstreams";

const API_KEY = process.env.API_KEY || "";
const GRAPHQL_URL = process.env.GRAPHQL_URL || "";

const receiptProcessedMutation = `
  mutation ReceiptProcessed(
    $id: String!
    $username: String!
    $price: Float
    $createdAt: Long
  ) {
    receiptProcessed(id: $id, username: $username, price: $price, createdAt: $createdAt) {
      id,
      username,
      price,
      createdAt
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
      id: data?.id.S,
      username: data?.username.S,
      price: Number(data?.price?.N),
      createdAt: Number(data?.createdAt?.N),
    },
  };

  console.log(JSON.stringify({ mutation, data }, null, 2));

  try {
    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      body: JSON.stringify(mutation),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
    }).then((res: any) => res.json());

    console.log(JSON.stringify({ res }, null, 2));
  } catch (error) {
    console.error(error, JSON.stringify(error));
  }
}

export const handler = async (event: DynamoDBStreamEvent) => {
  if (!API_KEY) {
    return { message: "Could not load the API Key" };
  }

  for (const record of event.Records) {
    if (["INSERT", "MODIFY"].includes(record.eventName || "")) {
      const data = record.dynamodb?.NewImage;

      await notifyReceiptProcessed({ data });
    } else {
      console.log("some other event", JSON.stringify(event, null, 2));
    }
  }

  return { message: `Finished processing ${event.Records.length} records` };
};
