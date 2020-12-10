import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import NextLink from "next/link";
import {
  useMeQuery,
  useLogoutMutation,
  MeQuery,
  MeDocument,
} from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const { data, loading } = useMeQuery({ ssr: !isServer() });
  const [logout, { loading: logoutLoading }] = useLogoutMutation({
    update: async cache => {
      await cache.writeQuery<MeQuery>({
        query: MeDocument,
        data: {
          __typename: "Query",
          me: null,
        },
      });
      cache.evict({ fieldName: "posts" });
      cache.gc();
    },
  });

  let body: null | ReactElement = null;

  if (loading) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/create-post">
          <Link as={Button} ml="auto">
            create post
          </Link>
        </NextLink>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex align="center">
        <NextLink href="/create-post">
          <Link as={Button} ml="auto" mr={4}>
            create post
          </Link>
        </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={() => logout()}
          isLoading={logoutLoading}
          variant="link"
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex bg="tomato" p={4} position="sticky" top={0} zIndex={1}>
      <Flex maxW={800} flex={1} m="auto" align="center">
        <NextLink href="/">
          <Link>
            <Heading>LiReddit</Heading>
          </Link>
        </NextLink>
        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  );
};
