import { useHistory } from "react-router-dom";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { UserPool } from "../Auth";
import Wrapper from "../components/Wrapper";
import { Form, Formik } from "formik";
import InputField from "../components/InputField";
import { Box, Button, FormControl, FormErrorMessage } from "@chakra-ui/core";

function Register() {
  const history = useHistory();

  return (
    <Wrapper size="small">
      <Formik
        initialValues={{ username: "", email: "", password: "", error: "" }}
        onSubmit={async (values, { setErrors }) => {
          const { username, password, email } = values;

          const attributes = [
            new CognitoUserAttribute({
              Name: "email",
              Value: email,
            }),
          ];

          UserPool.signUp(username, password, attributes, [], (error, data) => {
            if (error) {
              console.error({ error });
              setErrors({ error: error.message });
            } else {
              console.log({ data });
              history.push("/confirm");
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
                <InputField name="email" placeholder="Email" label="Email" />
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
                Register
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
}

export default Register;
