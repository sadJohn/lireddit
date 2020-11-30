import { Post } from "../entities/Post";
import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find();
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: string): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  createPost(@Arg("title") title: string): Promise<Post> {
    return Post.create({ title }).save();
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg("id") id: string,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | undefined> {
    const post = await Post.findOne(id);
    if (!post) {
      return undefined;
    }
    if (typeof title !== "undefined") {
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: string): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}
