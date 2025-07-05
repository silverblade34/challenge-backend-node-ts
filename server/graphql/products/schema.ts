// server/graphql/accounts/products.ts
import { gql } from 'apollo-server-express';

export const productsTypeDefs = gql`
  type Product {
    _id: ID!
    name: String!
    sku: String!
    stock: Int!
    accountId: ID
    createdAt: String
    updatedAt: String
  }

  input ProductInput {
    name: String!
    sku: String!
    stock: Int!
    accountId: ID
  }

  input PurchaseInput {
    accountId: ID!
    productId: ID!
    quantity: Int!
  }

  type PurchaseResponse {
    success: Boolean!
    message: String!
    remainingStock: Int
  }

  type Query {
    getProduct(id: ID!): Product
    getProductsByAccount(accountId: ID!): [Product!]!
  }

  type Mutation {
    createProduct(input: ProductInput!): Product!
    purchaseProduct(input: PurchaseInput!): PurchaseResponse!
  }
`;