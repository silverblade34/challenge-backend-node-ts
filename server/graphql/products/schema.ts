import { gql } from "apollo-server-express";

export const schema = gql`
  extend type Query {
    testProdQ: Boolean
  }

  extend type Mutation {
    testProdM: Boolean
  }
`;
