require("dotenv").config();
import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { Container } from "typedi";
import * as TypeORM from "typeorm";
import * as TypeGraphQL from "type-graphql";

import { authChecker } from "./authorization/auth-checker";
import { RecipeResolver } from "./resolvers/recipe-resolver";
import { RateResolver } from "./resolvers/rate-resolver";
import { Recipe } from "./entities/recipe";
import { Rate } from "./entities/rate";
import { User } from "./entities/user";
import { Place } from "./entities/place";
import { PlaceResolver } from "./resolvers/place-resolver";
import { UserResolver } from "./resolvers/user-resolver";
import { getUser } from "./utils/get-user";
import { PlaceList } from "./entities/place-list";
import { PlaceListResolver } from "./resolvers/place-list-resolver";

export interface Context {
  user: Partial<User>;
}

// register 3rd party IOC container
TypeORM.useContainer(Container);

async function bootstrap() {
  try {
    // create TypeORM connection
    await TypeORM.createConnection({
      type: "postgres",
      database: "type_graph",
      username: "root",
      password: "pass123",
      port: 5432,
      host: "localhost",
      entities: [Recipe, Rate, User, Place, PlaceList],
      synchronize: process.env.NODE_ENV === "production" ? false : true,
      logger: "advanced-console",
      logging: "all",
      dropSchema: false,
      cache: true
    });

    // build TypeGraphQL executable schema
    const schema = await TypeGraphQL.buildSchema({
      resolvers: [
        RecipeResolver,
        RateResolver,
        PlaceResolver,
        UserResolver,
        PlaceListResolver
      ],
      container: Container,
      authChecker
    });

    // Create GraphQL server
    const server = new ApolloServer({
      schema,
      context: ({ req }): Context => {
        const token = req.headers.authorization || "";
        const user = getUser(token);
        if (!user) return null;

        return { user };
      }
    });

    // Start the server
    const { url } = await server.listen(4000);
    console.log(`Server is running, GraphQL Playground available at ${url}`);
  } catch (err) {
    console.error(err);
  }
}

bootstrap();
