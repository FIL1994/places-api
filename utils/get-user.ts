import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../entities/user";

export function getUser(token: string) {
  const user: Partial<User> = jwt.verify(token, process.env.JWT_SECRET) as any;
  return user;
}

export async function getFullUser(token: string) {
  const decodedUser = getUser(token);
  const userRepository = getRepository(User);
  const user = await userRepository.findOne(decodedUser.id);
  return user;
}
