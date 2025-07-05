// server/services/odoo.ts
import xmlrpc from 'xmlrpc';
import logger from '../utils/logger';
import config from "../config/app";

interface OdooPartner {
  name: string;
  email: string;
  phone?: string;
  is_company?: boolean;
}

interface OdooConfig {
  url: string;
  db: string;
  username: string;
  password: string;
}

class OdooService {
  private config: OdooConfig;
  private uid: number | null = null;
  private commonClient: any;
  private objectClient: any;

  constructor() {
    this.config = {
      url: config.odoo.url,
      db: config.odoo.db,
      username: config.odoo.username,
      password: config.odoo.password,
    };

    const parsedUrl = new URL(this.config.url);
    const host = parsedUrl.hostname;
    const port = parsedUrl.port ? parseInt(parsedUrl.port, 10) : 8069;

    this.commonClient = xmlrpc.createClient({
      host: host,
      port: port,
      path: '/xmlrpc/2/common',
    });

    this.objectClient = xmlrpc.createClient({
      host: host,
      port: port,
      path: '/xmlrpc/2/object',
    });
  }

  private async authenticate(): Promise<number> {
    if (this.uid) {
      return this.uid;
    }

    return new Promise((resolve, reject) => {
      this.commonClient.methodCall(
        'authenticate',
        [this.config.db, this.config.username, this.config.password, {}],
        (err: any, uid: number) => {
          if (err) {
            logger.error('Error de autenticación en Odoo:', err);
            reject(err);
          } else {
            this.uid = uid;
            logger.info('Autenticado en Odoo con UID:', uid);
            resolve(uid);
          }
        }
      );
    });
  }

  async findPartnerByEmail(email: string): Promise<any> {
    try {
      const uid = await this.authenticate();

      return new Promise((resolve, reject) => {
        this.objectClient.methodCall(
          'execute_kw',
          [
            this.config.db,
            uid,
            this.config.password,
            'res.partner',
            'search_read',
            [[['email', '=', email]]],
            { fields: ['id', 'name', 'email', 'phone'] }
          ],
          (err: any, result: any) => {
            if (err) {
              logger.error('Error al buscar partner en Odoo:', err);
              reject(err);
            } else {
              resolve(result[0] || null);
            }
          }
        );
      });
    } catch (error) {
      logger.error('Error en findPartnerByEmail:', error);
      throw error;
    }
  }

  async createPartner(partner: OdooPartner): Promise<number> {
    try {
      const uid = await this.authenticate();

      return new Promise((resolve, reject) => {
        this.objectClient.methodCall(
          'execute_kw',
          [
            this.config.db,
            uid,
            this.config.password,
            'res.partner',
            'create',
            [partner]
          ],
          (err: any, partnerId: number) => {
            if (err) {
              logger.error('Error al crear partner en Odoo:', err);
              reject(err);
            } else {
              logger.info('Partner creado en Odoo con ID:', partnerId);
              resolve(partnerId);
            }
          }
        );
      });
    } catch (error) {
      logger.error('Error en createPartner:', error);
      throw error;
    }
  }

  async updatePartner(partnerId: number, updates: Partial<OdooPartner>): Promise<boolean> {
    try {
      const uid = await this.authenticate();

      return new Promise((resolve, reject) => {
        this.objectClient.methodCall(
          'execute_kw',
          [
            this.config.db,
            uid,
            this.config.password,
            'res.partner',
            'write',
            [[partnerId], updates]
          ],
          (err: any, result: boolean) => {
            if (err) {
              logger.error('Error al actualizar partner en Odoo:', err);
              reject(err);
            } else {
              logger.info('Partner actualizado en Odoo:', partnerId);
              resolve(result);
            }
          }
        );
      });
    } catch (error) {
      logger.error('Error en updatePartner:', error);
      throw error;
    }
  }

  async syncAccountWithOdoo(accountData: { name: string; email: string }): Promise<number> {
    try {
      const existingPartner = await this.findPartnerByEmail(accountData.email);

      if (existingPartner) {
        await this.updatePartner(existingPartner.id, {
          name: accountData.name,
          email: accountData.email
        });
        return existingPartner.id;
      } else {
        const partnerId = await this.createPartner({
          name: accountData.name,
          email: accountData.email,
          is_company: false
        });
        return partnerId;
      }
    } catch (error) {
      logger.error('Error al sincronizar cuenta con Odoo:', error);
      throw error;
    }
  }
}

const odooService = new OdooService();

export default odooService;

export const syncAccountWithOdoo = async (accountData: { name: string; email: string }) => {
  try {
    return await odooService.syncAccountWithOdoo(accountData);
  } catch (error) {
    logger.error('Error al sincronizar con Odoo:', error);
    return null;
  }
};