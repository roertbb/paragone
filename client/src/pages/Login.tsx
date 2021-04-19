import React, { useContext } from "react";
import { Box } from "@chakra-ui/layout";
import { Form, Formik } from "formik";
import { useHistory } from "react-router";
import { UserContext } from "../Auth";
import InputField from "../components/form/InputField";
import Button from "../components/Button";
import FormError from "../components/form/FormError";

function Login() {
  const history = useHistory();
  const { login } = useContext(UserContext);

  return (
    <Formik
      initialValues={{ username: "", password: "", error: "" }}
      onSubmit={async (values, { setErrors }) => {
        try {
          await login(values);
          history.push("/");
        } catch (error) {
          setErrors({ error });
        }
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
            {formError && <FormError formError={formError} />}
            <Button type="submit" isLoading={isSubmitting} w="100%">
              Login
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
}

export default Login;
