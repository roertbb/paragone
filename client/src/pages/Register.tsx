import React from "react";
import { useHistory } from "react-router";
import { Form, Formik } from "formik";
import { Box } from "@chakra-ui/layout";
import { confirmRegistration, register } from "../Auth";
import InputField from "../components/form/InputField";
import Button from "../components/Button";
import FormError from "../components/form/FormError";

type Step = "registration" | "confirmation";
type RegisterFormValues = {
  username: string;
  email: string;
  password: string;
  code: string;
  step: Step;
  error: string;
};

function Register() {
  const history = useHistory();

  const initialValues: RegisterFormValues = {
    username: "",
    email: "",
    password: "",
    code: "",
    step: "registration",
    error: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, { setErrors, setFieldValue }) => {
        const { username, password, email, code, step } = values;

        if (step === "registration") {
          try {
            await register({ username, password, email });
            setFieldValue("step", "confirmation");
          } catch (error) {
            setErrors({ error });
          }
        } else if (step === "confirmation") {
          try {
            await confirmRegistration({ username, code });
            history.push("/login");
          } catch (error) {
            setErrors({ error });
          }
        }
      }}
    >
      {({ isSubmitting, errors, values }) => {
        const formError = errors["error"];
        const isRegistrationStep = values.step === "registration";

        return (
          <Form>
            <Box mb={4}>
              <InputField
                name="username"
                placeholder="Username"
                label="Username"
              />
            </Box>
            {isRegistrationStep && (
              <Box mb={4}>
                <InputField name="email" placeholder="Email" label="Email" />
              </Box>
            )}
            {isRegistrationStep && (
              <Box mb={4}>
                <InputField
                  name="password"
                  placeholder="Password"
                  label="Password"
                  type="password"
                />
              </Box>
            )}
            {!isRegistrationStep && (
              <Box mb={4}>
                <InputField
                  name="code"
                  placeholder="Confirmation code"
                  label="Confirmation code"
                />
              </Box>
            )}
            {formError && <FormError formError={formError} />}
            <Button type="submit" isLoading={isSubmitting} w="100%">
              Register
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
}

export default Register;
