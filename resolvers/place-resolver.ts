import {
  Resolver,
  Query,
  Arg,
  Mutation,
  ID,
  Authorized,
  Ctx
} from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { Place } from "../entities/place";

import { PlaceInput } from "./types/place-input";
import { PlaceList } from "../entities/place-list";
import { Context } from "..";
import { AuthenticationError } from "apollo-server";
import { googleMapsClient } from "../helpers";

@Resolver(of => Place)
export class PlaceResolver {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    @InjectRepository(PlaceList)
    private readonly placeListRepository: Repository<PlaceList>
  ) {}

  private async findPlace(placeId: string) {
    return await this.placeRepository.findOne(placeId);
  }

  private checkUserOwnPlaceList(placeList: PlaceList, userId: string) {
    if (placeList.user.id !== userId) {
      throw new AuthenticationError(
        "User is not authorized to modify that place list"
      );
    }
  }

  private async checkUserOwnsPlace(place: Place, userId: string) {
    const placeUserId = await place.getUserId();

    if (placeUserId !== userId) {
      throw new AuthenticationError(
        "User is not authorized to modify that place list"
      );
    }
  }

  @Query(returns => Place, { nullable: true })
  place(@Arg("placeId", type => ID) placeId: string) {
    return this.placeRepository.findOne(placeId);
  }

  @Query(returns => [Place])
  async places(): Promise<Place[]> {
    return await this.placeRepository.find();
  }

  @Authorized()
  @Mutation(returns => Place)
  async addPlace(
    @Arg("place") placeInput: PlaceInput,
    @Ctx() { user }: Context
  ) {
    const placeList = await this.placeListRepository.findOneOrFail({
      where: {
        id: placeInput.placeListId
      }
    });
    this.checkUserOwnPlaceList(placeList, user.id);

    const place = this.placeRepository.create({
      ...placeInput
    });

    place.placeList = Promise.resolve(placeList);

    try {
      const res = await googleMapsClient
        .place({
          place_id: place.googleId,
          fields: ["photo"],
          language: "en"
        } as any)
        .asPromise();

      const photoReference = res.json.result.photos[0].photo_reference;
      place.photoReference = photoReference;
    } catch (e) {
      throw new Error(e);
    }

    return await this.placeRepository.save(place);
  }

  @Authorized()
  @Mutation(returns => Place)
  async updatePlace(
    @Arg("placeId", type => ID) placeId: string,
    @Arg("placeInput") placeInput: PlaceInput,
    @Ctx() { user }: Context
  ) {
    const place = await this.findPlace(placeId);
    await this.checkUserOwnsPlace(place, user.id);
    return await this.placeRepository.update(placeId, placeInput);
  }

  @Authorized()
  @Mutation(returns => Boolean)
  async deletePlace(
    @Arg("placeId", type => ID) placeId: string,
    @Ctx() { user }: Context
  ) {
    const place = await this.findPlace(placeId);
    await this.checkUserOwnsPlace(place, user.id);

    await this.placeRepository.remove(place);
    return true;
  }
}
