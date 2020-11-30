import { Box, Button, Flex, Link } from "@chakra-ui/react";
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
    update: cache => {
      cache.writeQuery<MeQuery>({
        query: MeDocument,
        data: {
          __typename: "Query",
          me: null,
        },
      });
    },
  });

  let body: null | ReactElement = null;

  if (loading) {
  } else if (!data?.me) {
    body = (
      <>
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
      <Flex>
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
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};
