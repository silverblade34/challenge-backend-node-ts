import { Schema } from "mongoose";

import { IProduct } from "../interfaces/product";

import { cnxProducts } from "../db/mongodb";

const productsSchema = new Schema<IProduct>(
  {
    name: { type: String },
    sku: { type: String },
  },
  { timestamps: true }
);

const Accounts = cnxProducts.model<IProduct>("Accounts", productsSchema);

export default Accounts;
