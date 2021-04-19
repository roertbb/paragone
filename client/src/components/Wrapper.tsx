import React from "react";
import { Box } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
}

const Wrapper = ({ children }: Props) => {
  return (
    <Box
      py={8}
      px={4}
      mx="auto"
      maxW="640px"
      w="100%"
      flex={1}
      d="flex"
      flexDirection="column"
    >
      {children}
    </Box>
  );
};

export default Wrapper;
