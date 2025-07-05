import { ObjectId } from 'mongodb';
import Products from '../../models/products';
import logger from '../../utils/logger';

export const productsQueries = {
  getProduct: async (_: any, { id }: { id: string }) => {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error('ID de producto inválido');
      }
      
      const product = await Products.findById(id);
      
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      
      return product;
    } catch (error) {
      logger.error('Error al obtener producto:', error);
      throw error;
    }
  },

  getProductsByAccount: async (_: any, { accountId }: { accountId: string }) => {
    try {
      if (!ObjectId.isValid(accountId)) {
        throw new Error('ID de cuenta inválido');
      }
      
      const products = await Products.find({ accountId: new ObjectId(accountId) })
        .sort({ createdAt: -1 });
      
      return products;
    } catch (error) {
      logger.error('Error al obtener productos por cuenta:', error);
      throw error;
    }
  }
};