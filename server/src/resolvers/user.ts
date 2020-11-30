import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import { User } from "../entities/User";
import { senEmail } from "../utils/sendEmail";
import { v4 } from "uuid";
import { FORGET_PASSWORD_PREFIX } from "../constants";

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@InputType()
class UserInfoInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { manager, redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "newPassword too short!",
          },
        ],
      };
    }
    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(FORGET_PASSWORD_PREFIX + token);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    const user = await manager.findOne(User, { id: userId });

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user nolonger exists",
          },
        ],
      };
    }
    user.password = await argon2.hash(newPassword);
    await manager.save(user);

    await redis.del(key);

    //login after reset pwd
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { manager, redis }: MyContext
  ) {
    const user = await manager.findOne(User, { email });
    if (!user) {
      return true;
    }

    const token = v4();

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    );

    await senEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
    );
    return true;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { manager, req }: MyContext): Promise<User | undefined> {
    const user = await manager.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") { username, password, email }: UserInfoInput,
    @Ctx() { manager, req }: MyContext
  ): Promise<UserResponse> {
    if (username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "username too short!",
          },
        ],
      };
    }
    if (!EMAIL_REGEX.test(email)) {
      return {
        errors: [
          {
            field: "email",
            message: "invalid email!",
          },
        ],
      };
    }
    if (password.length <= 3) {
      return {
        errors: [
          {
            field: "password",
            message: "password too short!",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(password);
    const user = manager.create(User, {
      username,
      email,
      password: hashedPassword,
    });
    try {
      await manager.save(user);
    } catch (err) {
      if (err.code === "23505") {
        let fieldName = "username";
        const errDetail = err.detail.match(/\(([^)]*)\)/);
        if (errDetail) {
          fieldName = errDetail[1];
        }
        return {
          errors: [
            {
              field: fieldName,
              message: `${fieldName} exist!`,
            },
          ],
        };
      }
    }
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { manager, req }: MyContext
  ): Promise<UserResponse> {
    const userField = EMAIL_REGEX.test(usernameOrEmail) ? "email" : "username";
    const user = await manager.findOne(User, { [userField]: usernameOrEmail });
    console.log("user", user);
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "user not exist!",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password!",
          },
        ],
      };
    }
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise(resolve =>
      req.session.destroy(err => {
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        res.clearCookie("qid");
        resolve(true);
      })
    );
  }
}
