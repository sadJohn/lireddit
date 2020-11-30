import { withApollo as createWithApollo } from "next-with-apollo";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

export default createWithApollo(
  () => {
    return new ApolloClient({
      uri: "http://localhost:4000/graphql",
      credentials: "include",
      cache: new InMemoryCache(),
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
