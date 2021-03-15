import React from "react";
import { Box, Text } from "@chakra-ui/core";

const UnexpectedError = () => {
  return (
    <Box
      d="flex"
      w="100%"
      flex={1}
      flexDirection={"column"}
      justifyContent="center"
      alignItems="center"
    >
      <Text>Unexpected error occured</Text>
    </Box>
  );
};

export default UnexpectedError;
