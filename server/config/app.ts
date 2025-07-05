import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

const config = {
  server: {
    port: Number(process.env.PORT || process.env.APP_PORT) || 3000,
  },
  dbnorel: {
    accounts: {
      uri: process.env.MONGODB_URL_ACCOUNTS!,
    },
    products: {
      uri: process.env.MONGODB_URL_PRODUCTS!,
    },
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  odoo: {
    url: process.env.ODOO_URL || 'http://localhost:8069',
    db: process.env.ODOO_DB || 'odoo',
    username: process.env.ODOO_USERNAME || 'admin',
    password: process.env.ODOO_PASSWORD || 'admin',
  },
  pagination: {
    page: Number(process.env.PAGE) || 1,
    perPage: Number(process.env.PER_PAGE) || 20,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

export default config;
