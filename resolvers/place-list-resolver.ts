import {
  Resolver,
  Query,
  Arg,
  Int,
  Mutation,
  Ctx,
  Authorized
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
  placeList(@Arg("placeListId", type => Int) placeListId: number) {
    return this.placeListRepository.findOne(placeListId);
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
