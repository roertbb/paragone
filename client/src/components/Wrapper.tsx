import React from "react";
import { Box } from "@chakra-ui/core";

interface Props {
  children: React.ReactNode;
  size?: "small" | "large";
  flex?: Boolean;
}

const Wrapper = ({ children, size = "large", flex = false }: Props) => {
  return (
    <Box
      my={8}
      px={4}
      mx="auto"
      maxW={size === "large" ? "800px" : "400px"}
      w="100%"
      d={flex ? "flex" : undefined}
      flex={flex ? 1 : undefined}
      flexDirection={flex ? "column" : undefined}
    >
      {children}
    </Box>
  );
};

export default Wrapper;
