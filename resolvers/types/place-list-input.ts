import { InputType, Field } from "type-graphql";
import { PlaceList } from "../../entities/place-list";

@InputType()
export class PlaceListInput implements Partial<PlaceList> {
  @Field()
  title: string;
}
