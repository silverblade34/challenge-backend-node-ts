import { gql } from "apollo-server-express";
import {
  accountsTypeDefs as accountsSchema,
} from "../accounts";
import {
  productsTypeDefs as productsSchema,
} from "../products";
import { accountsQueries } from "../accounts/queries";
import { accountsMutations } from "../accounts/mutations";
import { productsQueries } from "../products/queries";
import { productsMutations } from "../products/mutations";

const rootTypeDefs = gql`
  type Query {
    _: String
  }
  type Mutation {
    _: String
  }
`;

export const typeDefs = [rootTypeDefs, accountsSchema, productsSchema];

export const resolvers: any = {
  Query: {
    ...accountsQueries,
    ...productsQueries,
  },
  Mutation: {
    ...accountsMutations,
    ...productsMutations,
  },
};