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
import { ReactElement } from "react";
import { UpdootSection } from "../components/UpdootSection";

const Index = () => {
  const { data, loading, fetchMore } = usePostsQuery({
    variables: {
      limit: 10,
    },
  });

  let bottom: ReactElement | null;
  if (!data) {
    bottom = null;
  } else if (!data.posts.hasMore) {
    bottom = (
      <Flex>
        <Box m="auto" my={8}>
          no more posts
        </Box>
      </Flex>
    );
  } else {
    bottom = (
      <Flex>
        <Button
          m="auto"
          my={8}
          onClick={() =>
            fetchMore({
              variables: {
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
                limit: 10,
              },
            })
          }
        >
          load more
        </Button>
      </Flex>
    );
  }
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
      {!data?.posts.posts && loading ? (
        <Box>loading</Box>
      ) : (
        <Stack spacing={8}>
          {data?.posts.posts.map(post => (
            <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
              <UpdootSection post={post} />
              <Box>
                <Heading fontSize="xl">{post.title}</Heading>
                <Text>by {post.creator.username}</Text>
                <Text mt={4}>{post.textSnippet}</Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}
      {bottom}
    </Layout>
  );
};

export default withApollo(Index, { getDataFromTree });
