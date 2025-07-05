import Accounts from '../../models/accounts';
import { IAccountInput } from '../../interfaces/account';
import logger from '../../utils/logger';
import { syncAccountWithOdoo } from '../../services/odoo';

export const accountsMutations = {
  createAccount: async (_: any, { input }: { input: IAccountInput }) => {
    try {
      const existingAccount = await Accounts.findOne({ email: input.email });
      if (existingAccount) {
        throw new Error('Ya existe una cuenta con este email');
      }

      const account = new Accounts(input);
      await account.save();

      try {
        const odooPartnerId = await syncAccountWithOdoo({
          name: input.name,
          email: input.email
        });

        if (odooPartnerId) {
          logger.info(`Cuenta creada y sincronizada con Odoo - MongoDB ID: ${account._id}, Odoo Partner ID: ${odooPartnerId}`);
        } else {
          logger.warn(`Cuenta creada en MongoDB pero falló la sincronización con Odoo - ID: ${account._id}`);
        }
      } catch (odooError) {
        logger.error(`Error al sincronizar cuenta con Odoo, pero cuenta creada en MongoDB - ID: ${account._id}`, odooError);
      }

      logger.info(`Cuenta creada: ${account._id}`);
      return account;
    } catch (error) {
      logger.error('Error al crear cuenta:', error);
      throw error;
    }
  }
};