import { useHistory } from "react-router-dom";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { UserPool } from "../auth/UserPool";
import Wrapper from "../components/Wrapper";
import { Form, Formik } from "formik";
import InputField from "../components/InputField";
import { Box, Button } from "@chakra-ui/core";

function Register() {
  const history = useHistory();

  return (
    <Wrapper size="small">
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
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
            } else {
              console.log({ data });
              history.push("/login");
            }
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
            <Box mb={4}>
              <InputField name="email" placeholder="Email" label="Email" />
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
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default Register;
