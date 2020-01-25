import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  getConnection
} from "typeorm";
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

  @Field()
  @Column()
  googleId: string;

  @Field()
  @Column()
  photoReference: string;

  @Field(type => String, {
    nullable: true
  })
  @Column()
  imageUrl?: string;

  @ManyToOne(type => PlaceList, {
    nullable: false,
    lazy: true
  })
  placeList: Promise<PlaceList>;

  async getUserId(): Promise<string> {
    const placeList = await this.placeList;

    const user: { userId: string } = await getConnection()
      .createQueryBuilder()
      .from(PlaceList, "place_list")
      .select("user.id", "userId")
      .leftJoin("place_list.user", "user")
      .where("place_list.id = :id", { id: placeList.id })
      .getRawOne();

    return user.userId;
  }
}
