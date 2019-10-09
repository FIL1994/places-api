import { ObjectType, Field } from "type-graphql";
import { User } from "../../entities/user";

@ObjectType()
export class UserAndToken {
  @Field()
  token: string;

  @Field(type => User)
  user: User;
}
