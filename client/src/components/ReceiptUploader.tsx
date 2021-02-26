import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";

const getUploadUrlQuery = gql`
  query test {
    getUploadUrl
  }
`;

function ReceiptUploader() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<
    string | ArrayBuffer | null
  >(null);

  const { loading, error, data } = useQuery(getUploadUrlQuery);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  const uploadUrl = data.getUploadUrl as string;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    fetch(uploadUrl, {
      method: "PUT",
      body: file,
    })
      .then((res) => {
        if (res.ok) {
          console.log("success");
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
