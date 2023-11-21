import "dotenv/config";

const config = {
  server: {
    port: process.env.PORT || process.env.APP_PORT!,
  },
  dbnorel: {
    accounts: {
      uri: process.env.MONGODB_URL_ACCOUNTS!,
    },
    products: {
      uri: process.env.MONGODB_URL_PRODUCTS!,
    },
  },
  pagination: {
    page: Number(process.env.PAGE) || 1,
    perPage: Number(process.env.PAGE) || 20,
  },
};

export default config;
