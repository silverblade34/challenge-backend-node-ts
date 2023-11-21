import { gql } from "apollo-server-express";

export const schema = gql`
  extend type Query {
    testAccQ: Int
  }

  extend type Mutation {
    testAccM: Boolean
  }
`;
