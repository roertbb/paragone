import { gql, useQuery } from "@apollo/client";
import { Box, Button, List, ListItem, Text } from "@chakra-ui/core";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import * as t from "../../../graphql/generated-types";
import { getUsername } from "../auth/UserPool";
import Spinner from "../components/Spinner";
import UnexpectedError from "../components/UnexpectedError";
import Wrapper from "../components/Wrapper";

interface receiptsData {
  receipts: t.Query["receipts"];
}

const receiptsQuery = gql`
  query {
    receipts {
      id
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
      id
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

  return (
    <Wrapper size="small" flex>
      <Text textAlign="center" w="100%" mb={4}>
        Scanned receipts
      </Text>

      <Box
        flex={1}
        mb={4}
        bg="gray.50"
        borderRadius="0.25rem"
        borderWidth="1px"
      >
        <List styleType="none">
          {data?.receipts?.map((receipt) => {
            const { id, price } = receipt!;

            return (
              // TODO: extracto to another component
              <ListItem>
                <Box
                  d="flex}"
                  w="100%"
                  p={4}
                  borderRadius="0.25rem"
                  borderBottomWidth="1px"
                >
                  <Text isTruncated flex={1}>
                    {id}
                  </Text>
                  {price ? (
                    <Text ml={4} color="teal.600">
                      PLN {price}
                    </Text>
                  ) : undefined}
                </Box>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Link to="/upload">
        <Button variantColor="teal" w="100%">
          Add receipt
        </Button>
      </Link>
    </Wrapper>
  );
}

export default ReceiptList;
