import React from "react";
import { Box } from "@chakra-ui/core";

interface Props {
  children: React.ReactNode;
  size?: "small" | "large";
}

const Wrapper = ({ children, size = "large" }: Props) => {
  return (
    <Box mt={8} mx="auto" maxW={size === "large" ? "800px" : "400px"} w="100%">
      {children}
    </Box>
  );
};

export default Wrapper;
