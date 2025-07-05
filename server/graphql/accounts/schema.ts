// server/graphql/accounts/schema.ts
import { gql } from 'apollo-server-express';

export const accountsTypeDefs = gql`
  type Account {
    _id: ID!
    name: String!
    email: String!
    createdAt: String
    updatedAt: String
  }

  input AccountInput {
    name: String!
    email: String!
  }

  input AccountsFilter {
    name: String
    limit: Int
    offset: Int
  }

  type AccountsResponse {
    accounts: [Account!]!
    total: Int!
    hasMore: Boolean!
  }

  type Query {
    getAccount(id: ID!): Account
    getAccounts(filter: AccountsFilter): AccountsResponse!
  }

  type Mutation {
    createAccount(input: AccountInput!): Account!
  }
`;