import { InputType, Field, ID } from "type-graphql";
import { Place } from "../../entities/place";

@InputType()
export class PlaceInput implements Partial<Place> {
  @Field()
  title: string;

  @Field()
  address: string;

  @Field()
  lat: number;

  @Field()
  lng: number;

  @Field({ nullable: true })
  description?: string;

  @Field(type => String, {
    nullable: true
  })
  imageUrl?: string;

  @Field(type => ID)
  placeListId: string;
}
