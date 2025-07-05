// server/graphql/accounts/index.ts
import { accountsTypeDefs } from './schema';
import { accountsQueries } from './queries';
import { accountsMutations } from './mutations';

export const accountsResolvers = {
  Query: accountsQueries,
  Mutation: accountsMutations
};

export { accountsTypeDefs };