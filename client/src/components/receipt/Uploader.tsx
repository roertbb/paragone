import { useQuery } from "@apollo/client";
import { useToast } from "@chakra-ui/toast";
import React from "react";
import { getUploadUrlData, getUploadUrlQuery } from "../../graphql/receipts";
import Button from "../Button";
import Error from "../Error";
import Spinner from "../Spinner";

interface Props {
  file?: File;
  imagePreviewUrl?: string | ArrayBuffer | null;
  onUpload: () => void;
}

const ReceiptUploader = ({ file, imagePreviewUrl, onUpload }: Props) => {
  const toast = useToast();

  const { loading, error, data } = useQuery<getUploadUrlData>(
    getUploadUrlQuery
  );

  function handleSubmit() {
    fetch(data?.getUploadUrl!, {
      method: "PUT",
      body: file,
    })
      .then((res) => {
        if (res.ok) {
          onUpload();
          toast({
            title: `Receipt successfully uploaded!`,
            description:
              "It will show up in the listing once processing is completed",
            status: "success",
            position: "top",
            isClosable: true,
          });
        }
      })
      .catch((error) => console.error({ error }));
  }

  if (loading) return <Spinner />;
  if (error) return <Error error={error.message} />;

  return (
    <>
      {imagePreviewUrl && (
        <>
          <img src={imagePreviewUrl.toString()} alt="receipt" />
          <Button type="submit" w="100%" mt={8} onClick={handleSubmit}>
            Upload receipt
          </Button>
        </>
      )}
    </>
  );
};

export default ReceiptUploader;
