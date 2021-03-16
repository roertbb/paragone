import { gql, useQuery } from "@apollo/client";
import { Box, Button, Flex, Text } from "@chakra-ui/core";

import * as t from "../../../../graphql/generated-types";
import Spinner from "../Spinner";
import UnexpectedError from "../UnexpectedError";
import Wrapper from "../Wrapper";

interface getDownloadUrlData {
  getDownloadUrl: t.Query["getDownloadUrl"];
}

const getDownloadUrlQuery = gql`
  query getDownloadUrlQuery($id: String!) {
    getDownloadUrl(id: $id)
  }
`;

interface Props {
  selectedReceipt: t.Receipt;
  onClose: () => void;
}

const Details = ({
  selectedReceipt: { id, price, createdAt },
  onClose,
}: Props) => {
  const { loading, error, data } = useQuery<getDownloadUrlData>(
    getDownloadUrlQuery,
    { variables: { id } }
  );

  if (loading) return <Spinner />;
  if (error) return <UnexpectedError />;

  const date = new Date(createdAt);
  const day = date.toLocaleDateString();
  const time = date.toLocaleTimeString();

  return (
    <Wrapper flex>
      <Box
        flex="1"
        mb={4}
        borderWidth="1px"
        bg="gray.50"
        borderRadius="0.25rem"
      >
        <Flex justifyContent="center" p={4}>
          {data?.getDownloadUrl && (
            <img src={data?.getDownloadUrl} alt="receipt" />
          )}
        </Flex>
        <Flex p={4} flexDirection="column">
          <Flex
            flex={1}
            mb={2}
            alignItems="baseline"
            justifyContent="space-between"
          >
            <Text>Uploaded:</Text>
            <Text>
              {day} - {time}
            </Text>
          </Flex>
          <Flex flex={1} alignItems="baseline" justifyContent="space-between">
            <Text>Price:</Text>
            <Text color="teal.600">PLN {price}</Text>
          </Flex>
        </Flex>
      </Box>
      <Button variantColor="teal" onClick={onClose}>
        Back
      </Button>
    </Wrapper>
  );
};

export default Details;
