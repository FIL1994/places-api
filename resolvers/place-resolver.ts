import { Resolver, Query, Arg, Mutation, ID } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { Place } from "../entities/place";

import { PlaceInput } from "./types/place-input";
import { PlaceList } from "../entities/place-list";

@Resolver(of => Place)
export class PlaceResolver {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    @InjectRepository(PlaceList)
    private readonly placeListRepository: Repository<PlaceList>
  ) {}

  @Query(returns => Place, { nullable: true })
  place(@Arg("placeId", type => ID) placeId: number) {
    return this.placeRepository.findOne(placeId);
  }

  @Query(returns => [Place])
  async places(): Promise<Place[]> {
    return await this.placeRepository.find();
  }

  @Mutation(returns => Place) async addPlace(
    @Arg("place") placeInput: PlaceInput
  ) {
    const placeList = await this.placeListRepository.findOneOrFail({
      where: {
        id: placeInput.placeListId
      }
    });

    const place = this.placeRepository.create({
      ...placeInput,
      placeList
    });
    return await this.placeRepository.save(place);
  }

  @Mutation(returns => Place) async updatePlace(
    @Arg("placeId", type => ID) placeId: number,
    @Arg("placeInput") placeInput: PlaceInput
  ) {
    return await this.placeRepository.update(placeId, placeInput);
  }

  @Mutation(returns => Boolean) async deletePlace(
    @Arg("placeId", type => ID) placeId: number
  ) {
    const place = await this.placeRepository.findOne(placeId);
    await this.placeRepository.remove(place);
    return true;
  }
}
