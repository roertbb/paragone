import { useHistory } from "react-router-dom";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { UserPool } from "../Auth";
import Wrapper from "../components/Wrapper";
import { Form, Formik } from "formik";
import InputField from "../components/InputField";
import { Box, Button, FormControl, FormErrorMessage } from "@chakra-ui/core";

interface Props {
  onLogin: () => void;
}

function Login({ onLogin }: Props) {
  const history = useHistory();

  return (
    <Wrapper size="small" flex>
      <Formik
        initialValues={{ username: "", password: "", error: "" }}
        onSubmit={async (values, { setErrors }) => {
          const { username, password } = values;

          const user = new CognitoUser({ Username: username, Pool: UserPool });
          const authDetails = new AuthenticationDetails({
            Username: username,
            Password: password,
          });

          user.authenticateUser(authDetails, {
            onSuccess: (data) => {
              onLogin();
              history.push("/");
            },
            onFailure: (error) => {
              setErrors({ error: error.message });
            },
            newPasswordRequired: (data) =>
              console.error("newPasswordRequired", { data }),
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
                  name="password"
                  placeholder="Password"
                  label="Password"
                  type="password"
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
                Login
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
}

export default Login;
