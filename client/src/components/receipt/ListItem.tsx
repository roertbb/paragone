import {
  Box,
  ListItem as ChakraListItem,
  Spinner,
  Text,
} from "@chakra-ui/core";
import * as t from "../../../../graphql/generated-types";

interface Props {
  receipt: t.Receipt;
  onReceiptSelected: (receipt: t.Receipt) => void;
}

const ListItem = ({ receipt, onReceiptSelected }: Props) => {
  const { price, createdAt, processedAt } = receipt;

  const date = new Date(createdAt);
  const day = date.toLocaleDateString();
  const time = date.toLocaleTimeString();

  const renderPrice = () => {
    if (!processedAt) return <Spinner color="teal.600" />;
    else if (!price) return "-";
    else
      return (
        <Text ml={4} color="teal.600">
          PLN {price}
        </Text>
      );
  };

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
          {day} - {time}
        </Text>
        {renderPrice()}
      </Box>
    </ChakraListItem>
  );
};

export default ListItem;
