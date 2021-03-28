import { useHistory } from "react-router-dom";
import { CognitoUser } from "amazon-cognito-identity-js";
import { UserPool } from "../Auth";
import Wrapper from "../components/Wrapper";
import { Form, Formik } from "formik";
import InputField from "../components/InputField";
import { Box, Button, FormControl, FormErrorMessage } from "@chakra-ui/core";

function ConfirmEmail() {
  const history = useHistory();

  return (
    <Wrapper size="small">
      <Formik
        initialValues={{ username: "", code: "", error: "" }}
        onSubmit={async (values, { setErrors }) => {
          const { username, code } = values;

          const userData = {
            Username: username,
            Pool: UserPool,
          };

          const cognitoUser = new CognitoUser(userData);

          cognitoUser.confirmRegistration(code, true, (error, result) => {
            if (error) {
              setErrors({ error: error.message });
            } else {
              history.push("/login");
            }
          });
        }}
      >
        {({ isSubmitting, errors }) => {
          const formError = errors["error"];

          return (
            <Form>
              <Box mb={4}>
                <InputField
                  name="username"
                  placeholder="Username"
                  label="Username"
                />
              </Box>
              <Box mb={4}>
                <InputField
                  name="code"
                  placeholder="Confirmation code"
                  label="Confirmation code"
                />
              </Box>
              {formError ? (
                <FormControl mb={4} isInvalid={!!formError}>
                  <FormErrorMessage>{formError}</FormErrorMessage>
                </FormControl>
              ) : null}
              <Button
                type="submit"
                w="100%"
                isLoading={isSubmitting}
                variantColor="teal"
              >
                Confirm email
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
}

export default ConfirmEmail;
