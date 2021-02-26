import { gql, useQuery } from "@apollo/client";

const getUploadUrlQuery = gql`
  query test {
    getUploadUrl
  }
`;

function Test() {
  const { loading, error, data } = useQuery(getUploadUrlQuery);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export default Test;
