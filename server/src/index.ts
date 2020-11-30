import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { COOKIE_NAME } from "./constants";

const main = async () => {
  await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "lireddit",
    entities: ["dist/entities/**/*.js"],
    synchronize: true,
    logging: false,
  });

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTTL: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
      },
      saveUninitialized: false,
      secret: "dasdasdsadjasfaksfljlajj",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
    }),
  });

  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(4000, () => {
    console.log("server started on localhost:4000...");
  });
};

main();
