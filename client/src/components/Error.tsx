import React from "react";
import { Box, Text } from "@chakra-ui/react";

interface Props {
  error: string;
}

const Error = ({ error }: Props) => {
  return (
    <Box
      d="flex"
      w="100%"
      flex={1}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Text>{error}</Text>
    </Box>
  );
};

export default Error;
