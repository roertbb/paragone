import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import { ReceiptProcessor } from "./receiptProcessor";

export class ParagoneStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const receiptBucket = new s3.Bucket(this, "receiptBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new ReceiptProcessor(this, "receiptProcessor", { receiptBucket });
  }
}
