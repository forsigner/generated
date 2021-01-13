import { Result } from "stook-graphql";
import { mutate } from "stook";
import { USER } from "@generated/gql";
import { User } from "@generated/types";

class MutatorService {
  mutateUser(fn: (state: User) => void): void {
    mutate(USER, (state: Result<User>) => {
      fn(state.data)
    })
  }
}

export const Mutator = new MutatorService();
