import { Resolver, Query, Arg, Int, Mutation } from "type-graphql";
import { Place } from "../entities/place";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { PlaceInput } from "./types/place-input";

@Resolver(of => Place)
export class PlaceResolver {
  constructor(
    @InjectRepository(Place) private readonly placeRepository: Repository<Place>
  ) {}

  @Query(returns => Place, { nullable: true })
  place(@Arg("placeId", type => Int) placeId: number) {
    return this.placeRepository.findOne(placeId);
  }

  @Query(returns => [Place])
  places(): Promise<Place[]> {
    return this.placeRepository.find();
  }

  @Mutation(returns => Place) async addPlace(
    @Arg("place") placeInput: PlaceInput
  ) {
    const place = this.placeRepository.create({
      ...placeInput
    });
    return await this.placeRepository.save(place);
  }
}
