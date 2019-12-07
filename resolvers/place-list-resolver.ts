import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Ctx,
  Authorized,
  ID
} from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { PlaceList } from "../entities/place-list";
import { PlaceListInput } from "./types/place-list-input";
import { Context } from "..";
import { User } from "../entities/user";

@Resolver(of => PlaceList)
export class PlaceListResolver {
  constructor(
    @InjectRepository(PlaceList)
    private readonly placeListRepository: Repository<PlaceList>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  @Query(returns => PlaceList, { nullable: true })
  async placeList(@Arg("placeListId", type => ID) placeListId: number) {
    const placeList = await this.placeListRepository.findOne(placeListId);
    return placeList;
  }

  @Query(returns => [PlaceList], { nullable: true })
  async placeLists() {
    const placeLists = await this.placeListRepository.find();
    return placeLists;
  }

  @Authorized()
  @Mutation(returns => PlaceList)
  async addPlaceList(
    @Arg("placeList") placeListInput: PlaceListInput,
    @Ctx() { user }: Context
  ): Promise<PlaceList> {
    const userFromDb = await this.userRepository.findOneOrFail(user.id);

    const placeList = this.placeListRepository.create({
      ...placeListInput,
      user: userFromDb,
      places: []
    });

    return await this.placeListRepository.save(placeList);
  }
}
