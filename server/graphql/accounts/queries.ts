import { ObjectId } from 'mongodb';
import Accounts from '../../models/accounts';
import { IAccountsFilter } from '../../interfaces/account';
import logger from '../../utils/logger';

export const accountsQueries = {
  getAccount: async (_: any, { id }: { id: string }) => {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error('ID de cuenta inválido');
      }
      
      const account = await Accounts.findById(id);
      
      if (!account) {
        throw new Error('Cuenta no encontrada');
      }
      
      return account;
    } catch (error) {
      logger.error('Error al obtener cuenta:', error);
      throw error;
    }
  },

  getAccounts: async (_: any, { filter }: { filter?: IAccountsFilter }) => {
    try {
      const { name, limit = 10, offset = 0 } = filter || {};
      
      const query: any = {};
      if (name) {
        query.name = { $regex: name, $options: 'i' };
      }
      
      const accounts = await Accounts.find(query)
        .limit(limit)
        .skip(offset)
        .sort({ createdAt: -1 });
      
      const total = await Accounts.countDocuments(query);
      const hasMore = offset + limit < total;
      
      return {
        accounts,
        total,
        hasMore
      };
    } catch (error) {
      logger.error('Error al obtener cuentas:', error);
      throw error;
    }
  }
};