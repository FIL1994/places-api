import { InputType, Field } from "type-graphql";
import { Place } from "../../entities/place";

@InputType()
export class PlaceInput implements Partial<Place> {
  @Field()
  title: string;

  @Field()
  address: string;

  @Field({ nullable: true })
  description?: string;

  @Field(type => [String], {
    nullable: true,
    defaultValue: []
  })
  imageUrls?: string[];
}
