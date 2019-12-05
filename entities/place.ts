import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { PlaceList } from "./place-list";

@Entity()
@ObjectType()
export class Place {
  @Field(type => ID)
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  address: string;

  @Field()
  @Column({
    type: "float"
  })
  lat: number;

  @Field()
  @Column({
    type: "float"
  })
  lng: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(type => [String], {
    nullable: true
  })
  @Column("simple-array", {
    nullable: true
  })
  imageUrls?: string[];

  @ManyToOne(type => PlaceList, {
    nullable: false
  })
  placeList: PlaceList;
}
