import { gql } from "@apollo/client";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostsQuery, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostsQuery["posts"]["posts"][0];
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [vote, { loading }] = useVoteMutation({
    update: (cache, { data }) => {
      let newVoteStatus = post.voteStatus;
      if ((data?.vote as number) !== post.points) {
        newVoteStatus = (data?.vote as number) > post.points ? 1 : -1;
      }
      cache.writeFragment({
        id: cache.identify({ __typename: "Post", id: post.id }),
        fragment: gql`
          fragment _ on Post {
            points
            voteStatus
          }
        `,
        data: {
          points: data?.vote,
          voteStatus: newVoteStatus,
        },
      });
    },
  });
  const [loadingState, setLoadingState] = useState<"up" | "down" | "">("");
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
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
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        onClick={() => {
          setLoadingState("down");
          vote({ variables: { value: -1, postId: post.id } });
        }}
        aria-label="downdoot post"
        icon={<ChevronDownIcon />}
        isLoading={loading && loadingState === "down"}
      ></IconButton>
    </Flex>
  );
};
