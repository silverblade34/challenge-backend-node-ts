import { ObjectId } from 'mongodb';

export interface IAccount {
  _id?: ObjectId;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAccountInput {
  name: string;
  email: string;
}

export interface IAccountsFilter {
  name?: string;
  limit?: number;
  offset?: number;
}

export interface IAccountsResponse {
  accounts: IAccount[];
  total: number;
  hasMore: boolean;
}