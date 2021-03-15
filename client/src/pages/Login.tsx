import { useHistory } from "react-router-dom";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { UserPool } from "../auth/UserPool";
import Wrapper from "../components/Wrapper";
import { Form, Formik } from "formik";
import InputField from "../components/InputField";
import { Box, Button } from "@chakra-ui/core";

interface Props {
  onLogin: () => void;
}

function Login({ onLogin }: Props) {
  const history = useHistory();

  return (
    <Wrapper size="small" flex>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const { username, password } = values;

          const user = new CognitoUser({ Username: username, Pool: UserPool });
          const authDetails = new AuthenticationDetails({
            Username: username,
            Password: password,
          });

          user.authenticateUser(authDetails, {
            onSuccess: (data) => {
              console.log("success", { data });

              onLogin();
              history.push("/");
            },
            onFailure: (error) => {
              console.log("failure", { error });

              if (error.code === "UserNotFoundException") {
                setErrors({ username: error.message });
              } else {
                setErrors({ password: error.message });
              }
            },
            newPasswordRequired: (data) =>
              console.log("newPasswordRequired", { data }),
          });
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mb={4}>
              <InputField
                name="username"
                placeholder="Username"
                label="Username"
              />
            </Box>
            <Box mb={8}>
              <InputField
                name="password"
                placeholder="Password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              type="submit"
              w="100%"
              isLoading={isSubmitting}
              variantColor="teal"
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default Login;
