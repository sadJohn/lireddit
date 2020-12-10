import React from "react";
import withApollo from "../../utils/withApollo";
import { getDataFromTree } from "@apollo/react-ssr";
import { useRouter } from "next/dist/client/router";
import { usePostQuery } from "../../generated/graphql";
import { Layout } from "../../components/Layout";
import { Box, Heading } from "@chakra-ui/react";

const Post: React.FC = () => {
  const router = useRouter();
  const { data, loading } = usePostQuery({
    variables: { id: router.query.id ? (router.query.id as string) : "" },
  });
  if (loading) {
    return <Box>loading</Box>;
  }
  return (
    <Layout variant="regular">
      <Heading>{data?.post?.title}</Heading>
      <Box>{data?.post?.text}</Box>
    </Layout>
  );
};

export default withApollo(Post, { getDataFromTree });
