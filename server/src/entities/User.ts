import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Post } from "./Post";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column("text", { unique: true })
  username: string;

  @Field()
  @Column("text", { unique: true })
  email: string;

  @Column("text")
  password: string;

  @OneToMany(() => Post, post => post.creator)
  posts: Post[];

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
