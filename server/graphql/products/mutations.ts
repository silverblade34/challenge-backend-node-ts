import { ObjectId } from 'mongodb';
import Products from '../../models/products';
import Accounts from '../../models/accounts';
import { IProductInput, IPurchaseInput } from '../../interfaces/product';
import logger from '../../utils/logger';
import { syncProductWithOdoo } from '../../services/odoo';

export const productsMutations = {
  createProduct: async (_: any, { input }: { input: IProductInput }) => {
    try {
      const existingProduct = await Products.findOne({ sku: input.sku });
      if (existingProduct) {
        throw new Error('Ya existe un producto con este SKU');
      }

      if (input.accountId) {
        if (!ObjectId.isValid(input.accountId)) {
          throw new Error('ID de cuenta inválido');
        }

        const account = await Accounts.findById(input.accountId);
        if (!account) {
          throw new Error('Cuenta no encontrada');
        }
      }

      const productData = {
        ...input,
        accountId: input.accountId ? new ObjectId(input.accountId) : undefined
      };

      const product = new Products(productData);
      await product.save();

      try {
        const odooProductId = await syncProductWithOdoo({
          name: input.name,
          sku: input.sku,
          stock: input.stock,
        });

        if (odooProductId) {
          logger.info(`Producto creado y sincronizado con Odoo - MongoDB ID: ${product._id}, Odoo Product ID: ${odooProductId}`);
        } else {
          logger.warn(`Producto creado en MongoDB pero falló la sincronización con Odoo - ID: ${product._id}`);
        }
      } catch (odooError) {
        logger.error(`Error al sincronizar producto con Odoo, pero producto creado en MongoDB - ID: ${product._id}`, odooError);
      }

      logger.info(`Producto creado: ${product._id}`);
      return product;
    } catch (error) {
      logger.error('Error al crear producto:', error);
      throw error;
    }
  },

  purchaseProduct: async (_: any, { input }: { input: IPurchaseInput }) => {
    try {
      const { accountId, productId, quantity } = input;

      if (!ObjectId.isValid(accountId) || !ObjectId.isValid(productId)) {
        throw new Error('IDs inválidos');
      }

      if (quantity <= 0) {
        throw new Error('La cantidad debe ser mayor a 0');
      }

      const account = await Accounts.findById(accountId);
      if (!account) {
        throw new Error('Cuenta no encontrada');
      }

      const product = await Products.findById(productId);
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      if (product.stock < quantity) {
        return {
          success: false,
          message: `Stock insuficiente. Stock disponible: ${product.stock}`,
          remainingStock: product.stock
        };
      }

      product.stock -= quantity;
      await product.save();

      try {
        await syncProductWithOdoo({
          name: product.name,
          sku: product.sku,
          stock: product.stock
        });
        logger.info(`Stock sincronizado con Odoo para producto: ${productId}`);
      } catch (odooError) {
        logger.error(`Error al sincronizar stock con Odoo para producto: ${productId}`, odooError);
      }

      logger.info(`Compra realizada - Producto: ${productId}, Cantidad: ${quantity}, Stock restante: ${product.stock}`);

      return {
        success: true,
        message: `Compra realizada exitosamente. Cantidad: ${quantity}`,
        remainingStock: product.stock
      };
    } catch (error) {
      logger.error('Error al realizar compra:', error);
      throw error;
    }
  }
};