import { Resolver, Query, Arg, Int, Mutation, ID } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { User } from "../entities/user";
import { UserInput } from "./types/user-input";

@Resolver(of => User)
export class UserResolver {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  //   @Query(returns => User, { nullable: true })
  //   user(@Arg("userId", type => Int) userId: number) {
  //     return this.userRepository.findOne(userId);
  //   }

  @Mutation(returns => User) async addUser(@Arg("user") userInput: UserInput) {
    const user = this.userRepository.create({
      ...userInput
    });
    return await this.userRepository.save(user);
  }
}
