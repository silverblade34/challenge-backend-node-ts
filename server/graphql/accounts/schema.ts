import { gql } from "apollo-server-express";

export const schema = gql`
  extend type Query {
    testAccQ: Boolean
  }

  extend type Mutation {
    testAccM: Boolean
  }
`;
