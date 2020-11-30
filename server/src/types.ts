import { EntityManager } from "typeorm";
import { Request, Response } from "express";
import { Redis } from "ioredis";

export type MyContext = {
  manager: EntityManager;
  req: Request & { session: { userId: string } };
  res: Response;
  redis: Redis;
};
