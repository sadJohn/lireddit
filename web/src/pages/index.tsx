import { usePostsQuery } from "../generated/graphql";
import withApollo from "../utils/withApollo";
import { getDataFromTree } from "@apollo/react-ssr";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import NextLink from "next/link";

const Index = () => {
  const { data, loading } = usePostsQuery({
    variables: {
      limit: 10,
    },
  });
  if (!loading && !data) {
    return <Box>you got query failed for some reason</Box>;
  }
  return (
    <Layout variant="regular">
      <Flex align="center">
        <Heading>LiReddit</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">create post</Link>
        </NextLink>
      </Flex>
      <br />
      {!data?.posts && loading ? (
        <div>loading</div>
      ) : (
        <Stack spacing={8}>
          {data?.posts.map(post => (
            <Box key={post.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{post.title}</Heading>
              <Text mt={4}>{post.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
      {data && (
        <Flex>
          <Button m="auto" my={8}>
            load more
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withApollo(Index, { getDataFromTree });
