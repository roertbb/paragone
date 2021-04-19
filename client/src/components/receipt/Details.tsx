import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Flex, Image, Text } from "@chakra-ui/react";
import * as t from "../../../../graphql/generated-types";
import {
  getDownloadUrlData,
  getDownloadUrlQuery,
} from "../../graphql/receipts";
import { timestampToDateTime } from "../../utils/time";
import Spinner from "../Spinner";
import Error from "../Error";
import Button from "../Button";

interface Props {
  selectedReceipt: t.Receipt;
  onClose: () => void;
}

const ReceiptDetails = ({
  selectedReceipt: { id, price, createdAt },
  onClose,
}: Props) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { loading, error, data } = useQuery<getDownloadUrlData>(
    getDownloadUrlQuery,
    { variables: { id } }
  );

  if (loading) return <Spinner />;
  if (error) return <Error error={error.message} />;

  return (
    <>
      <Flex
        direction="column"
        flex="1"
        mb={4}
        bg="gray.50"
        borderWidth="1px"
        borderRadius="0.25rem"
      >
        <Flex justifyContent="center" flex={1} p={4}>
          {!imageLoaded && <Spinner />}
          {data?.getDownloadUrl && (
            <Image
              display={imageLoaded ? "inline-block" : "none"}
              src={data?.getDownloadUrl}
              alt="receipt"
              objectFit="contain"
              onLoad={() => setImageLoaded(true)}
            />
          )}
        </Flex>
        <Flex p={4} flexDirection="column">
          <Flex
            mb={2}
            flex={1}
            alignItems="baseline"
            justifyContent="space-between"
          >
            <Text>Uploaded:</Text>
            <Text>{timestampToDateTime(createdAt)}</Text>
          </Flex>
          <Flex flex={1} alignItems="baseline" justifyContent="space-between">
            <Text>Price:</Text>
            <Text color="teal.600">PLN {price}</Text>
          </Flex>
        </Flex>
      </Flex>
      <Button onClick={onClose}>Back</Button>
    </>
  );
};

export default ReceiptDetails;
