import { Schema } from 'mongoose';
import { IProduct } from '../interfaces/product';
import { cnxProducts } from '../db/mongodb';

const productsSchema = new Schema<IProduct>(
  {
    name: { 
      type: String, 
      required: true,
      trim: true 
    },
    sku: { 
      type: String, 
      required: true,
      unique: true,
      trim: true 
    },
    stock: { 
      type: Number, 
      required: true,
      min: 0 
    },
    accountId: { 
      type: Schema.Types.ObjectId, 
      required: false 
    },
  },
  { 
    timestamps: true,
    collection: 'products' 
  }
);

productsSchema.index({ name: 1, sku: 1 });

const Products = cnxProducts.model<IProduct>('Products', productsSchema);
export default Products;