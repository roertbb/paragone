import { Box, ListItem as ChakraListItem, Text } from "@chakra-ui/core";
import * as t from "../../../../graphql/generated-types";

interface Props {
  receipt: t.Receipt;
  onReceiptSelected: (receipt: t.Receipt) => void;
}

const ListItem = ({ receipt, onReceiptSelected }: Props) => {
  const { id, price } = receipt;

  return (
    <ChakraListItem onClick={() => onReceiptSelected(receipt)}>
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
    </ChakraListItem>
  );
};

export default ListItem;
