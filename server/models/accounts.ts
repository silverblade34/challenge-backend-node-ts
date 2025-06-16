import { Schema } from "mongoose";

import { IAccount } from "../interfaces/account";

import { cnxAccounts } from "../db/mongodb";

const accountsSchema = new Schema<IAccount>(
  {
    name: { type: String },
    email: { type: String },
  },
  { timestamps: true }
);

const Accounts = cnxAccounts.model<IAccount>("Accounts", accountsSchema);

export default Accounts;
