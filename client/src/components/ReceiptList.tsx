import { gql, useQuery } from "@apollo/client";
import * as t from "../../../graphql/generated-types";

interface receiptsData {
  receipts: t.Query["receipts"];
}

const receiptsQuery = gql`
  query {
    receipts {
      filename
      price
    }
  }
`;

function ReceiptList() {
  const { loading, error, data } = useQuery<receiptsData>(receiptsQuery);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  return (
    <ul>
      {data?.receipts?.map((receipt) => {
        const { filename, price } = receipt!;

        return (
          <li key={filename}>
            {filename} - {price}
          </li>
        );
      })}
    </ul>
  );
}

export default ReceiptList;
