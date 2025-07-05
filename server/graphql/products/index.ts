import { productsTypeDefs } from './schema';
import { productsQueries } from './queries';
import { productsMutations } from './mutations';

export const productsResolvers = {
  Query: productsQueries,
  Mutation: productsMutations
};

export { productsTypeDefs };