import { S3 } from "aws-sdk";
import { AppSyncResolverHandler } from "aws-lambda";
import * as t from "../graphql/generated-types";

const BucketName = process.env.BUCKET_NAME!;
const s3 = new S3();
const URL_EXPIRATION_SECONDS = 300;

export const handler: AppSyncResolverHandler<
  t.QueryGetDownloadUrlArgs,
  t.Query["getDownloadUrl"]
> = async ({ arguments: { id }, identity }) => {
  const username = identity?.username;
  const filename = `${username}/${id}`;

  const s3Params = {
    Bucket: BucketName,
    Key: filename,
    Expires: URL_EXPIRATION_SECONDS,
  };

  return await s3.getSignedUrlPromise("getObject", s3Params);
};
