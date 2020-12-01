import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { InputField } from "../components/InputField";
import { useCreatePostMutation } from "../generated/graphql";
import withApollo from "../utils/withApollo";
import { Layout } from "../components/Layout";
import { useIsAuth } from "../utils/useIsAuth";

interface createPostProps {}

const CreatePost: React.FC<createPostProps> = ({}) => {
  useIsAuth();
  const router = useRouter();
  const [createPost] = useCreatePostMutation({
    update: cache => {
      cache.evict({ fieldName: "posts" });
    },
  });
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async value => {
          const { errors } = await createPost({
            variables: { postInput: value },
          });
          if (!errors) {
            router.push("/");
          }
        }}
      >
        {props => (
          <Form>
            <InputField name="title" label="Title" placeholder="title" />
            <Box mt={4}>
              <InputField
                name="text"
                label="Body"
                placeholder="text..."
                textarea
              />
            </Box>
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={props.isSubmitting}
              type="submit"
            >
              create post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo(CreatePost);
