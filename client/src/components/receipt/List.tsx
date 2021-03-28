import { useState } from "react";
import { Box, Button, List, Text } from "@chakra-ui/core";
import * as t from "../../../../graphql/generated-types";
import Wrapper from "../Wrapper";
import ReceiptDetails from "./Details";
import ListItem from "./ListItem";
import ReceiptUploader from "./Uploader";

interface Props {
  receipts: t.Query["receipts"];
}

const ReceiptList = ({ receipts }: Props) => {
  const [isUploadShown, setIsUploadShown] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<t.Receipt | null>(
    null
  );

  if (isUploadShown)
    return <ReceiptUploader onUploadSuccess={() => setIsUploadShown(false)} />;
  if (selectedReceipt)
    return (
      <ReceiptDetails
        selectedReceipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    );

  return (
    <Wrapper flex>
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
          {receipts?.map((receipt) =>
            receipt ? (
              <ListItem
                key={receipt.id}
                receipt={receipt}
                onReceiptSelected={setSelectedReceipt}
              />
            ) : undefined
          )}
        </List>
      </Box>

      <Button
        variantColor="teal"
        w="100%"
        onClick={() => setIsUploadShown(true)}
      >
        Add receipt
      </Button>
    </Wrapper>
  );
};

export default ReceiptList;
