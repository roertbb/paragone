import { gql } from "@apollo/client";
import * as t from "../../../graphql/generated-types";

export type receiptsData = {
  receipts: t.Query["receipts"];
};

export const receiptsQuery = gql`
  query {
    receipts {
      id
      price
      createdAt
      processedAt
    }
  }
`;

export type onReceiptProcessedData = {
  onReceiptProcessed: t.Subscription["onReceiptProcessed"];
};

export const receiptsSubscription = gql`
  subscription onReceiptProcessed($username: String!) {
    onReceiptProcessed(username: $username) {
      id
      price
      username
      createdAt
      processedAt
    }
  }
`;

export type getDownloadUrlData = {
  getDownloadUrl: t.Query["getDownloadUrl"];
};

export const getDownloadUrlQuery = gql`
  query getDownloadUrlQuery($id: String!) {
    getDownloadUrl(id: $id)
  }
`;

export interface getUploadUrlData {
  getUploadUrl: t.Query["getUploadUrl"];
}

export const getUploadUrlQuery = gql`
  query {
    getUploadUrl
  }
`;
