# Paragone

Store your receipts in the :cloud: instead of bloating your wallet! :money_with_wings:

#### [Link to live version](https://d1wxf4eisp5jnc.cloudfront.net/)

## How it works?

![Architecture](./architecture.svg)

The whole application architectures consist of 2 stacks:

### ParagoneFrontendStack

Stores frontend app built with React in Amazon S3 using Amazon CloudFront as CDN

### ParagoneStack

Handles the backend for the applications.

- GraphQL API serves as an entry point for the client app and uses Cognito for authentication.
- User gets presigned URL to the S3 bucket to store (`getUploadUrl`) and retrieve (`getDownloadUrl`) receipt images.
- Inserting new object into the bucket triggers the asynchronous processing. The `sendReceiptToTextract` Lambda stores the image metadata in DynamoDB and starts the image processing using Textract.
- Once the analysis is completed, the `sendTextractResultToDynamo` Lambda is triggered based on SNS notification. It retrieves the text detection results from Textract, performs naive heuristics to get the price and stores it in DynamoDB.
- When the data is inserted or updated in DynamoDB, it triggers `receiptProcessed` Lambda performing GraphQL mutation. It triggers the GraphQL subscription, pushing the update to the web app client.

## Demo

<div align="center">
  <img src="./demo.gif">
</div>
