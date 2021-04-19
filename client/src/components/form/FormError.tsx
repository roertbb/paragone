import React from "react";
import { FormControl, FormErrorMessage } from "@chakra-ui/form-control";

interface Props {
  formError: string;
}

const FormError = ({ formError }: Props) => {
  return (
    <FormControl mb={4} isInvalid={!!formError}>
      <FormErrorMessage>{formError}</FormErrorMessage>
    </FormControl>
  );
};

export default FormError;
