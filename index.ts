require("dotenv").config();
import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { Container } from "typedi";
import * as TypeORM from "typeorm";
import * as TypeGraphQL from "type-graphql";

import { RecipeResolver } from "./resolvers/recipe-resolver";
import { RateResolver } from "./resolvers/rate-resolver";
import { Recipe } from "./entities/recipe";
import { Rate } from "./entities/rate";
import { User } from "./entities/user";
import { seedDatabase } from "./helpers";
import { Place } from "./entities/place";
import { PlaceResolver } from "./resolvers/place-resolver";
import { UserResolver } from "./resolvers/user-resolver";

export interface Context {
  user: User;
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
      entities: [Recipe, Rate, User, Place],
      synchronize: process.env.NODE_ENV === "production" ? false : true,
      logger: "advanced-console",
      logging: "all",
      dropSchema: false,
      cache: true
    });

    // seed database with some data
    const { defaultUser } = await seedDatabase();

    // build TypeGraphQL executable schema
    const schema = await TypeGraphQL.buildSchema({
      resolvers: [RecipeResolver, RateResolver, PlaceResolver, UserResolver],
      container: Container
    });

    // Create GraphQL server
    const server = new ApolloServer({
      schema,
      context: ({ req }): Context => {
        const token = req.headers.authorization || "";
        // const user = getUser(token);
        // if(!user) return null;

        return { user: defaultUser };
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
