import React from "react";
import { Box } from "@chakra-ui/layout";
import { Spinner as ChakraSpinner, SpinnerProps } from "@chakra-ui/spinner";

const Spinner = (props: SpinnerProps) => {
  return (
    <Box
      d="flex"
      w="100%"
      flex={1}
      flexDirection={"column"}
      justifyContent="center"
      alignItems="center"
    >
      <ChakraSpinner color="teal.600" size="xl" thickness="4px" {...props} />
    </Box>
  );
};

export default Spinner;
