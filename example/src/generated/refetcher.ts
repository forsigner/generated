import { RefetchOptions, fetcher } from "stook-graphql";
import { User, QueryUserArgs } from "@generated/types";
import { USER } from "@generated/gql";

class RefetcherService {
  async refetchUser(args: QueryUserArgs = {} as QueryUserArgs, opt: RefetchOptions = {}): Promise<User> {

    const key = USER
    if (!fetcher.get(key)) {
      return console.warn('fetcher找不到' + key) as any
    }
    if (Object.keys(args).length) opt.variables = args
    if (!opt.showLoading) opt.showLoading = false
    return await fetcher.get(key).refetch(opt)

  }
}

export const Refetcher = new RefetcherService();
