import { Options, useQuery, useMutate } from "stook-graphql";
import { User, QueryUserArgs } from "@generated/types";
import { USER } from "@generated/gql";

class HooksService {
  useUser(args?: QueryUserArgs | (() => QueryUserArgs), opt: Options = {}) {
    return useQuery<User, QueryUserArgs>(USER, { ...opt, variables: args })
  }
}

export const Hooks = new HooksService();
