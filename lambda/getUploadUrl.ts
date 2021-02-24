import { S3 } from "aws-sdk";
import { AppSyncResolverHandler } from "aws-lambda";
import { uuid } from "uuidv4";
import * as t from "../graphql/generated-types";

const BucketName = process.env.BUCKET_NAME!;
const s3 = new S3();
const URL_EXPIRATION_SECONDS = 300;

export const handler: AppSyncResolverHandler<
  undefined,
  t.Query["getUploadUrl"]
> = async (event) => {
  const username = event.identity?.username;
  const filename = `${username}-${uuid()}.jpg`;

  const s3Params = {
    Bucket: BucketName,
    Key: filename,
    Expires: URL_EXPIRATION_SECONDS,
    ContentType: "image/jpeg",
  };

  return await s3.getSignedUrlPromise("putObject", s3Params);
};
