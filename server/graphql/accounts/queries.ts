import Accounts from "../../models/accounts";

export const queries = {
  testAccQ: async (_: any) => {
    const accounts = await Accounts.find({});
    return accounts.length;
  },
};
