import React, { useEffect, useContext } from "react";
import { useQuery } from "@apollo/client";
import * as t from "../../../graphql/generated-types";
import { UserContext } from "../Auth";
import {
  onReceiptProcessedData,
  receiptsData,
  receiptsQuery,
  receiptsSubscription,
} from "../graphql/receipts";
import Spinner from "../components/Spinner";
import Error from "../components/Error";
import ReceiptList from "../components/receipt/List";

const Receipts = () => {
  const { username } = useContext(UserContext);
  const { loading, error, data, subscribeToMore } = useQuery<receiptsData>(
    receiptsQuery
  );

  useEffect(() => {
    subscribeToMore<onReceiptProcessedData>({
      document: receiptsSubscription,
      variables: { username },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const prevReceipts = prev.receipts || [];
        const newReceipt = subscriptionData.data.onReceiptProcessed;
        const newReceiptIndex = prevReceipts.findIndex(
          (receipt) => receipt?.id === newReceipt?.id
        );

        // replace existing element if already in the list
        if (newReceiptIndex !== -1) {
          const receipts = [...prevReceipts];
          receipts[newReceiptIndex] = newReceipt as t.Receipt;

          return { receipts } as receiptsData;
        }

        // append element at the end of the list
        return {
          receipts: [newReceipt, ...prevReceipts],
        } as receiptsData;
      },
    });
  }, [subscribeToMore, username]);

  if (loading) return <Spinner />;
  if (error) return <Error error={error?.message} />;

  return <ReceiptList receipts={data?.receipts} />;
};

export default Receipts;
