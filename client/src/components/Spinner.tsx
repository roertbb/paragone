import { Box, Spinner as ChakraSpinner } from "@chakra-ui/core";

interface Props {}

const Spinner = (props: Props) => {
  return (
    <Box
      d="flex"
      w="100%"
      flex={1}
      flexDirection={"column"}
      justifyContent="center"
      alignItems="center"
    >
      <ChakraSpinner color="teal.600" size="xl" thickness="4px" />
    </Box>
  );
};

export default Spinner;
