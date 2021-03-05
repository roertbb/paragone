import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import * as t from "../../../graphql/generated-types";
import { useHistory } from "react-router";
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

  const { loading, error, data } = useQuery<getUploadUrlData>(
    getUploadUrlQuery
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input className="fileInput" type="file" onChange={handleChange} />
        <div>
          {imagePreviewUrl && (
            <img src={imagePreviewUrl.toString()} alt="receipt" />
          )}
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default ReceiptUploader;
