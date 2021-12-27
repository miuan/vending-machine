import axios from "axios";
import { getGraphqlMonsterClientAppRoot } from "./utils";

const initAuth = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("user.token")}`,
  },
});

export const depositApi = {
  getMe: () => axios.get(`${getGraphqlMonsterClientAppRoot()}/auth/me`, initAuth()),
  addDeposit: (deposit) => axios.post(`${getGraphqlMonsterClientAppRoot()}/api/deposit`, { deposit }, initAuth()),
  resetDeposit: () => axios.post(`${getGraphqlMonsterClientAppRoot()}/api/reset`, {}, initAuth()),
  buyProduct: (productId) => axios.post(`${getGraphqlMonsterClientAppRoot()}/api/buy`, { productId }, initAuth()),
  loadProducts: (filter) => axios.get(`${getGraphqlMonsterClientAppRoot()}/api/product/all`, initAuth()),
};
