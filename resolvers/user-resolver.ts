import { Resolver, Arg, Mutation } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import { User } from "../entities/user";
import { UserInput } from "./types/user-input";
import { UserAndToken } from "./types/user-and-token";

@Resolver(of => User)
export class UserResolver {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  //   @Query(returns => User, { nullable: true })
  //   user(@Arg("userId", type => Int) userId: number) {
  //     return this.userRepository.findOne(userId);
  //   }

  @Mutation(returns => User) async signup(@Arg("user") userInput: UserInput) {
    const user = this.userRepository.create({
      ...userInput,
      password: await bcrypt.hash(userInput.password, 10)
    });
    return await this.userRepository.save(user);
  }

  @Mutation(returns => UserAndToken) async login(
    @Arg("user") userInput: UserInput
  ) {
    const user = await this.userRepository.findOneOrFail({
      where: {
        email: userInput.email
      }
    });

    const doPasswordsMatch = await bcrypt.compare(
      userInput.password,
      user.password
    );

    if (!doPasswordsMatch) {
      throw new Error("Invalid login");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d"
      }
    );

    return {
      user,
      token
    };
  }
}
