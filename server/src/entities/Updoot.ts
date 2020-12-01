import { Entity, BaseEntity, ManyToOne, PrimaryColumn, Column } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Updoot extends BaseEntity {
  @Column("int")
  value: number;

  @PrimaryColumn()
  userId: string;

  @ManyToOne(() => User, user => user.updoots)
  user: User;

  @PrimaryColumn()
  postId: string;

  @ManyToOne(() => Post, post => post.updoots)
  post: Post;
}
