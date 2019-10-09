import { InputType, Field } from "type-graphql";
import { User } from "../../entities/user";

@InputType()
export class UserInput implements Partial<User> {
  @Field()
  email: string;

  @Field({ nullable: true })
  nickname?: string;

  @Field()
  password: string;
}
