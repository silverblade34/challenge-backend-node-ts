import Products from "../../models/products";

export const queries = {
  testProdQ: async (_: any) => {
    const products = await Products.find({});
    return products.length;
  },
};
