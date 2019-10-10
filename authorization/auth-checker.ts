import { AuthChecker } from "type-graphql";
import { Context } from "../index";

export const authChecker: AuthChecker<Context> = (
  { context: { user } },
  _roles
) => {
  return !!user;
};
