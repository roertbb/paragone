import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import * as t from "../../../graphql/generated-types";
import { getUsername } from "../Auth";
import Spinner from "../components/Spinner";
import UnexpectedError from "../components/UnexpectedError";
import ReceiptList from "../components/receipt/List";

interface receiptsData {
  receipts: t.Query["receipts"];
}

const receiptsQuery = gql`
  query {
    receipts {
      id
      price
      createdAt
      processedAt
    }
  }
`;

interface onReceiptProcessedData {
  onReceiptProcessed: t.Subscription["onReceiptProcessed"];
}

const receiptsSubscription = gql`
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

const Receipts = () => {
  const { loading, error, data, subscribeToMore } = useQuery<receiptsData>(
    receiptsQuery
  );

  useEffect(() => {
    console.log("subscribeToMore");
    subscribeToMore<onReceiptProcessedData>({
      document: receiptsSubscription,
      variables: { username: getUsername() },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const prevReceipts = prev.receipts || [];
        const newReceipt = subscriptionData.data.onReceiptProcessed;
        const newReceiptIndex = prevReceipts.findIndex(
          (receipt) => receipt?.id === newReceipt?.id
        );

        if (newReceiptIndex !== -1) {
          const receipts = [...prevReceipts];
          receipts[newReceiptIndex] = newReceipt as t.Receipt;

          return { receipts } as receiptsData;
        }

        return {
          receipts: [newReceipt, ...prevReceipts],
        } as receiptsData;
      },
    });
  }, [subscribeToMore]);

  if (loading) return <Spinner />;
  if (error) return <UnexpectedError />;

  return <ReceiptList receipts={data?.receipts} />;
};

export default Receipts;
