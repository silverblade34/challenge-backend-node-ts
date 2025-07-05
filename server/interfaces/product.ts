import { ObjectId } from 'mongodb';

export interface IProduct {
  _id?: ObjectId;
  name: string;
  sku: string;
  stock: number;
  accountId?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductInput {
  name: string;
  sku: string;
  stock: number;
  accountId?: string;
}

export interface IPurchaseInput {
  accountId: string;
  productId: string;
  quantity: number;
}

export interface IPurchaseResponse {
  success: boolean;
  message: string;
  remainingStock?: number;
}