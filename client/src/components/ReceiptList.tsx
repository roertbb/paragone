import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import * as t from "../../../graphql/generated-types";
import { getUsername } from "../auth/UserPool";

interface receiptsData {
  receipts: t.Query["receipts"];
}

const receiptsQuery = gql`
  query {
    receipts {
      filename
      price
    }
  }
`;

interface onReceiptProcessedData {
  onReceiptProcessed: t.Subscription["onReceiptProcessed"];
}

const receiptsSubscription = gql`
  subscription onReceiptProcessed($username: String!) {
    onReceiptProcessed(username: $username) {
      filename
      price
      username
    }
  }
`;

function ReceiptList() {
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
          receipts: [...(prev.receipts || []), newReceipt],
        } as receiptsData;
      },
    });
  }, [subscribeToMore]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  return (
    <ul>
      {data?.receipts?.map((receipt) => {
        const { filename, price } = receipt!;

        return (
          <li key={filename}>
            {filename} - {price}
          </li>
        );
      })}
    </ul>
  );
}

export default ReceiptList;
