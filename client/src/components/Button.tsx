import React from "react";
import { Button as ChakraButton, ButtonProps } from "@chakra-ui/button";

const Button = (props: ButtonProps) => {
  return <ChakraButton colorScheme="teal" {...props} />;
};

export default Button;
