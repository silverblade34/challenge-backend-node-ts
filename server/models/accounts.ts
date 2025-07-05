import { Schema } from 'mongoose';
import { IAccount } from '../interfaces/account';
import { cnxAccounts } from '../db/mongodb';

const accountsSchema = new Schema<IAccount>(
  {
    name: { 
      type: String, 
      required: true,
      trim: true 
    },
    email: { 
      type: String, 
      required: true,
      unique: true,
      trim: true,
      lowercase: true 
    },
  },
  { 
    timestamps: true,
    collection: 'accounts' 
  }
);

const Accounts = cnxAccounts.model<IAccount>('Accounts', accountsSchema);
export default Accounts;