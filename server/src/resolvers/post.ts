import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { manager }: MyContext): Promise<Post[]> {
    return manager.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: string,
    @Ctx() { manager }: MyContext
  ): Promise<Post | undefined> {
    return manager.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { manager }: MyContext
  ): Promise<Post> {
    const post = manager.create(Post, { title });
    await manager.save(post);
    return post;
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg("id") id: string,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { manager }: MyContext
  ): Promise<Post | undefined> {
    const post = await manager.findOne(Post, { id });
    if (!post) {
      return undefined;
    }
    if (typeof title !== "undefined") {
      post.title = title;
      await manager.save(post);
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: string,
    @Ctx() { manager }: MyContext
  ): Promise<boolean> {
    const post = await manager.findOne(Post, { id });
    if (!post) {
      return true;
    }
    await manager.remove(post);
    return true;
  }
}
