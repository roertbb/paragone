import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3Deployment from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";

export class ParagoneFrontendStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const websiteBucket = new s3.Bucket(this, "paragoneWebsiteBucket", {
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html",
    });

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "paragoneWebsiteCloudfrontDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: websiteBucket,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );

    new s3Deployment.BucketDeployment(this, "paragoneWebsiteDeployment", {
      destinationBucket: websiteBucket,
      sources: [s3Deployment.Source.asset("./client/build")],
      retainOnDelete: false,
      distribution,
      distributionPaths: ["/*"],
    });

    new cdk.CfnOutput(this, "WebsiteAddress", {
      value: distribution.distributionDomainName,
    });
  }
}
