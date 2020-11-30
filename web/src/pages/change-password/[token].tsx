import { GetServerSideProps, NextPage } from "next";
import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { toErrorMap } from "../../utils/toErrorMap";
import { useChangePasswordMutation } from "../../generated/graphql";
import { useRouter } from "next/dist/client/router";
import withApollo from "../../utils/withApollo";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "", comfirm: "" }}
        onSubmit={async ({ newPassword, comfirm }, { setErrors }) => {
            console.log(newPassword, comfirm)
          if (newPassword !== comfirm) {
            setErrors({ comfirm: "password does not match!" });
            return;
          }
          const response = await changePassword({
            variables: { newPassword, token },
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(toErrorMap(response.data.changePassword.errors));
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {props => (
          <Form>
            <InputField
              name="newPassword"
              label="New Password"
              placeholder="new password"
              type="password"
            />
            <Box mt={4}>
              <InputField
                name="comfirm"
                label="Comfirm"
                placeholder="comfirm password"
                type="password"
              />
            </Box>
            {tokenError && <Box style={{ color: "red" }}>{tokenError}</Box>}
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={props.isSubmitting}
              type="submit"
            >
              change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      token: query.token,
    },
  };
};

export default withApollo(ChangePassword);
