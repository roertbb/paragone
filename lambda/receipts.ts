import { DynamoDB } from "aws-sdk";
import { AppSyncResolverHandler } from "aws-lambda";
import * as t from "../graphql/generated-types";

export const TableName = process.env.TABLE_NAME!;
export const db = new DynamoDB.DocumentClient();

export const handler: AppSyncResolverHandler<
  undefined,
  t.Query["receipts"]
> = async ({ identity }) => {
  try {
    const params = {
      TableName,
      KeyConditionExpression: "username = :u",
      ExpressionAttributeValues: {
        ":u": identity?.username,
      },
    };

    const { Items } = await db.query(params).promise();

    if (Items) {
      return Items as t.Query["receipts"];
    } else {
      return undefined;
    }
  } catch (error) {
    console.log({ error });
    return undefined;
  }
};
