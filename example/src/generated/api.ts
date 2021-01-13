import { Options, query } from "stook-graphql";
import { User, QueryUserArgs } from "@generated/types";
import { USER } from "@generated/gql";

class ApiService {
  async User(args: QueryUserArgs = {} as QueryUserArgs, opt: Options = {}) {
    return await query<User>(USER, { ...opt, variables: args })
  }
}

export const apiService = new ApiService();
