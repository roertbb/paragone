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
    }
  }
`;

interface Props {}

const Receipts = (props: Props) => {
  const { loading, error, data, subscribeToMore } = useQuery<receiptsData>(
    receiptsQuery
  );

  useEffect(() => {
    subscribeToMore<onReceiptProcessedData>({
      document: receiptsSubscription,
      variables: { username: getUsername() },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newReceipt = subscriptionData.data.onReceiptProcessed;

        return {
          receipts: [
            ...(prev.receipts || []).filter(
              (receipt) =>
                receipt?.id !== subscriptionData.data.onReceiptProcessed?.id
            ),
            newReceipt,
          ],
        } as receiptsData;
      },
    });
  }, [subscribeToMore]);

  if (loading) return <Spinner />;
  if (error) return <UnexpectedError />;

  return <ReceiptList receipts={data?.receipts} />;
};

export default Receipts;
