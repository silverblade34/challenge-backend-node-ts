import xmlrpc from 'xmlrpc';
import logger from '../utils/logger';
import config from "../config/app";

interface OdooPartner {
  name: string;
  email: string;
  phone?: string;
  is_company?: boolean;
}

interface OdooProduct {
  name: string;
  default_code: string;
  detailed_type: 'product' | 'consu' | 'service';
  categ_id: number;
  list_price?: number;
  standard_price?: number;
  qty_available?: number;
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

  async findProductBySku(sku: string): Promise<any> {
    try {
      const uid = await this.authenticate();

      return new Promise((resolve, reject) => {
        this.objectClient.methodCall(
          'execute_kw',
          [
            this.config.db,
            uid,
            this.config.password,
            'product.product',
            'search_read',
            [[['default_code', '=', sku]]],
            { fields: ['id', 'name', 'default_code', 'qty_available', 'list_price'] }
          ],
          (err: any, result: any) => {
            if (err) {
              logger.error('Error al buscar producto en Odoo:', err);
              reject(err);
            } else {
              resolve(result[0] || null);
            }
          }
        );
      });
    } catch (error) {
      logger.error('Error en findProductBySku:', error);
      throw error;
    }
  }

  async createProduct(product: OdooProduct): Promise<number> {
    try {
      const uid = await this.authenticate();

      return new Promise((resolve, reject) => {
        this.objectClient.methodCall(
          'execute_kw',
          [
            this.config.db,
            uid,
            this.config.password,
            'product.product',
            'create',
            [product]
          ],
          (err: any, productId: number) => {
            if (err) {
              logger.error('Error al crear producto en Odoo:', err);
              reject(err);
            } else {
              logger.info('Producto creado en Odoo con ID:', productId);
              resolve(productId);
            }
          }
        );
      });
    } catch (error) {
      logger.error('Error en createProduct:', error);
      throw error;
    }
  }

  async updateProductStock(productId: number, newStock: number, locationId: number = 8): Promise<boolean> {
    try {
      const uid = await this.authenticate();

      const existingQuants = await this.findStockQuants(productId, locationId);
      
      if (existingQuants && existingQuants.length > 0) {
        return await this.updateStockQuant(existingQuants[0].id, newStock);
      } else {
        return await this.createStockQuant(productId, locationId, newStock);
      }
    } catch (error) {
      logger.error('Error en updateProductStock:', error);
      throw error;
    }
  }

  private async findStockQuants(productId: number, locationId: number): Promise<any[]> {
    const uid = await this.authenticate();

    return new Promise((resolve, reject) => {
      this.objectClient.methodCall(
        'execute_kw',
        [
          this.config.db,
          uid,
          this.config.password,
          'stock.quant',
          'search_read',
          [[['product_id', '=', productId], ['location_id', '=', locationId]]],
          { fields: ['id', 'quantity', 'product_id', 'location_id'] }
        ],
        (err: any, result: any[]) => {
          if (err) {
            logger.error('Error al buscar quants en Odoo:', err);
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  private async updateStockQuant(quantId: number, newQuantity: number): Promise<boolean> {
    const uid = await this.authenticate();

    return new Promise((resolve, reject) => {
      this.objectClient.methodCall(
        'execute_kw',
        [
          this.config.db,
          uid,
          this.config.password,
          'stock.quant',
          'write',
          [[quantId], { quantity: newQuantity }]
        ],
        (err: any, result: boolean) => {
          if (err) {
            logger.error('Error al actualizar quant en Odoo:', err);
            reject(err);
          } else {
            logger.info('Quant actualizado en Odoo:', quantId);
            resolve(result);
          }
        }
      );
    });
  }

  private async createStockQuant(productId: number, locationId: number, quantity: number): Promise<boolean> {
    const uid = await this.authenticate();

    return new Promise((resolve, reject) => {
      this.objectClient.methodCall(
        'execute_kw',
        [
          this.config.db,
          uid,
          this.config.password,
          'stock.quant',
          'create',
          [{
            product_id: productId,
            location_id: locationId,
            quantity: quantity
          }]
        ],
        (err: any, result: number) => {
          if (err) {
            logger.error('Error al crear quant en Odoo:', err);
            reject(err);
          } else {
            logger.info('Quant creado en Odoo con ID:', result);
            resolve(true);
          }
        }
      );
    });
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

  async syncProductWithOdoo(productData: {
    name: string; sku: string; stock: number, productType?: 'product' | 'consumable' | 'service'
  }): Promise<number> {
    try {
      const existingProduct = await this.findProductBySku(productData.sku);

      if (existingProduct) {
        // Actualizar stock del producto existente
        await this.updateProductStock(existingProduct.id, productData.stock);
        return existingProduct.id;
      } else {
        // Crear nuevo producto
        const productId = await this.createProduct({
          name: productData.name,
          default_code: productData.sku,
          detailed_type: productData.productType === 'consumable' ? 'consu' : 
                        productData.productType === 'service' ? 'service' : 'product',
          categ_id: 1,
          list_price: 0,
          standard_price: 0
        });

        // Establecer el stock inicial
        await this.updateProductStock(productId, productData.stock);
        return productId;
      }
    } catch (error) {
      logger.error('Error al sincronizar producto con Odoo:', error);
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

export const syncProductWithOdoo = async (productData: { name: string; sku: string; stock: number }) => {
  try {
    return await odooService.syncProductWithOdoo(productData);
  } catch (error) {
    logger.error('Error al sincronizar producto con Odoo:', error);
    return null;
  }
};