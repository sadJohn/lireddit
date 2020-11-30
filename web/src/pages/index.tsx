import { NavBar } from "../components/NavBar";
import { usePostsQuery } from "../generated/graphql";
import withApollo from "../utils/withApollo";
import { getDataFromTree } from "@apollo/react-ssr";

const Index = () => {
  const { data } = usePostsQuery();
  return (
    <>
      <NavBar />
      <div>Hello</div>
      {!data?.posts ? (
        <div>loading</div>
      ) : (
        data?.posts.map(post => <div>{post.title}</div>)
      )}
    </>
  );
};

export default withApollo(Index, { getDataFromTree });
