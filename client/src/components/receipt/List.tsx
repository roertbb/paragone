import React, { Reducer, useReducer, useRef } from "react";
import { Box, Text } from "@chakra-ui/layout";
import { List } from "@chakra-ui/react";
import * as t from "../../../../graphql/generated-types";
import Button from "../Button";
import ReceiptListItem from "./ListItem";
import ReceiptDetails from "./Details";
import ReceiptUploader from "./Uploader";

type ReceiptListReducer = {
  selectedReceipt?: t.Receipt;
  file?: File;
  imagePreviewUrl?: string | ArrayBuffer | null;
};

interface Props {
  receipts: t.Query["receipts"];
}

const ReceiptList = ({ receipts }: Props) => {
  const [{ selectedReceipt, file, imagePreviewUrl }, setState] = useReducer<
    Reducer<ReceiptListReducer, Partial<ReceiptListReducer>>
  >((prevState, curState) => ({ ...prevState, ...curState }), {
    selectedReceipt: undefined,
    file: undefined,
    imagePreviewUrl: undefined,
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleImageSelected(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();

    const reader = new FileReader();
    const file = event?.target?.files?.[0];

    reader.onloadend = () => {
      setState({
        file,
        imagePreviewUrl: reader.result,
      });
    };

    reader.readAsDataURL(file!);
  }

  if (file)
    return (
      <ReceiptUploader
        file={file}
        imagePreviewUrl={imagePreviewUrl}
        onUpload={() =>
          setState({ file: undefined, imagePreviewUrl: undefined })
        }
      />
    );
  if (selectedReceipt)
    return (
      <ReceiptDetails
        selectedReceipt={selectedReceipt}
        onClose={() => setState({ selectedReceipt: undefined })}
      />
    );

  return (
    <>
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
        <List>
          {receipts?.map((receipt) => (
            <ReceiptListItem
              key={receipt!.id}
              receipt={receipt!}
              onReceiptSelected={(receipt: t.Receipt) =>
                setState({ selectedReceipt: receipt })
              }
            />
          ))}
        </List>
      </Box>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageSelected}
        ref={inputRef}
        style={{ display: "none" }}
      ></input>
      <Button w="100%" onClick={() => inputRef?.current?.click()}>
        Add receipt
      </Button>
    </>
  );
};

export default ReceiptList;
