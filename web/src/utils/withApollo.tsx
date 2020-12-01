import { withApollo as createWithApollo } from "next-with-apollo";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const defaultPostsCache = {
  hasMore: false,
  posts: [],
  __typename: "PaginatedPosts",
};

export default createWithApollo(
  () => {
    return new ApolloClient({
      uri: "http://localhost:4000/graphql",
      credentials: "include",
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              posts: {
                keyArgs: false,
                merge(existing = defaultPostsCache, incoming) {
                  return {
                    hasMore: incoming.hasMore,
                    __typename: "PaginatedPosts",
                    posts: [...existing.posts, ...incoming.posts],
                  };
                },
              },
            },
          },
        },
      }),
    });
  },
  {
    render: ({ Page, props }) => {
      return (
        <ApolloProvider client={props.apollo}>
          <Page {...props} />
        </ApolloProvider>
      );
    },
  }
);
