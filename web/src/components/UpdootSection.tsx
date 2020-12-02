import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostsQuery, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostsQuery["posts"]["posts"][0];
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [vote, { loading }] = useVoteMutation();
  const [loadingState, setLoadingState] = useState<"up" | "down" | "">("");
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        onClick={() => {
          setLoadingState("up");
          vote({ variables: { value: 1, postId: post.id } });
        }}
        aria-label="updoot post"
        icon={<ChevronUpIcon />}
        isLoading={loading && loadingState === "up"}
      ></IconButton>
      {post.points}
      <IconButton
        onClick={() => {
          vote({ variables: { value: -1, postId: post.id } });
        }}
        aria-label="downdoot post"
        icon={<ChevronDownIcon />}
        isLoading={loading && loadingState === "down"}
      ></IconButton>
    </Flex>
  );
};
