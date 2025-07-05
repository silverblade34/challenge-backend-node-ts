// server/graphql/accounts/mutations.ts
import Accounts from '../../models/accounts';
import { IAccountInput } from '../../interfaces/account';
import logger from '../../utils/logger';

export const accountsMutations = {
  createAccount: async (_: any, { input }: { input: IAccountInput }) => {
    try {
      const existingAccount = await Accounts.findOne({ email: input.email });
      if (existingAccount) {
        throw new Error('Ya existe una cuenta con este email');
      }
      
      const account = new Accounts(input);
      await account.save();
      
      logger.info(`Cuenta creada: ${account._id}`);
      return account;
    } catch (error) {
      logger.error('Error al crear cuenta:', error);
      throw error;
    }
  }
};