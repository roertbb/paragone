import { Button } from "@chakra-ui/core";
import React, { useRef, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import * as t from "../../../graphql/generated-types";
import { useHistory } from "react-router";
import Wrapper from "./Wrapper";
import Spinner from "../components/Spinner";
import UnexpectedError from "../components/UnexpectedError";

interface getUploadUrlData {
  getUploadUrl: t.Query["getUploadUrl"];
}

const getUploadUrlQuery = gql`
  query {
    getUploadUrl
  }
`;

function ReceiptUploader() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<
    string | ArrayBuffer | null
  >(null);

  const history = useHistory();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { loading, error, data } = useQuery<getUploadUrlData>(
    getUploadUrlQuery
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    fetch(data?.getUploadUrl!, {
      method: "PUT",
      body: file,
    })
      .then((res) => {
        if (res.ok) {
          console.log("success");
          history.push("/");
        }
      })
      .catch((error) => console.log({ error }));
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();

    const reader = new FileReader();
    const file = event?.target?.files?.[0];

    reader.onloadend = () => {
      setFile(file);
      setImagePreviewUrl(reader.result);
    };

    reader.readAsDataURL(file!);
  }

  if (loading) return <Spinner />;
  if (error) return <UnexpectedError />;

  return (
    <Wrapper size="small" flex>
      <input
        type="file"
        onChange={handleChange}
        ref={inputRef}
        style={{ display: "none" }}
      ></input>
      <Button
        onClick={() => inputRef?.current?.click()}
        variantColor="teal"
        mb={8}
        w="100%"
      >
        Select receipt to upload
      </Button>

      {imagePreviewUrl && (
        <>
          <img src={imagePreviewUrl.toString()} alt="receipt" />
          <Button
            type="submit"
            variantColor="teal"
            w="100%"
            mt={8}
            onClick={handleSubmit}
          >
            Upload receipt
          </Button>
        </>
      )}
    </Wrapper>
  );
}

export default ReceiptUploader;
