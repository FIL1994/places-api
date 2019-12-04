import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Place } from "./place";
import { User } from "./user";

@Entity()
@ObjectType()
export class PlaceList {
  @Field(type => ID)
  @PrimaryGeneratedColumn("uuid")
  readonly id: number;

  @Field(type => User)
  @ManyToOne(type => User)
  user: User;

  @Field()
  @Column()
  title: string;

  @Field(type => [Place])
  @OneToMany(
    type => Place,
    place => place.placeList,
    { cascade: ["insert"] }
  )
  places: Place[];
}
