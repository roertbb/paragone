import React from "react";
import { Box, ListItem, Spinner, Text } from "@chakra-ui/react";
import * as t from "../../../../graphql/generated-types";
import { timestampToDateTime } from "../../utils/time";

interface Props {
  receipt: t.Receipt;
  onReceiptSelected: (receipt: t.Receipt) => void;
}

const ReceiptListItem = ({ receipt, onReceiptSelected }: Props) => {
  const { price, createdAt, processedAt } = receipt;

  function handleCurrentReceiptSelected() {
    onReceiptSelected(receipt);
  }

  const renderPrice = () => {
    if (!processedAt) {
      return <Spinner color="teal.600" />;
    } else if (!price) {
      return "-";
    }
    return (
      <Text ml={4} color="teal.600">
        PLN {price}
      </Text>
    );
  };

  return (
    <ListItem onClick={handleCurrentReceiptSelected}>
      <Box
        d="flex"
        w="100%"
        p={4}
        borderRadius="0.25rem"
        borderBottomWidth="1px"
      >
        <Text isTruncated flex={1}>
          {timestampToDateTime(createdAt)}
        </Text>
        {renderPrice()}
      </Box>
    </ListItem>
  );
};

export default ReceiptListItem;
