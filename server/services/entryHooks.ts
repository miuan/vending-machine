import { RequestError } from "../gen/api-utils";

export const hooks = {
  services: {
    beforeProductCreate: async (entry, { data }) => {
      if (data.cost % 5 === 0) return data;

      throw new RequestError("Cost should be divided by 5 current value is: '${data.cost}'");
    },
    beforeProductUpdate: async (entry, { data }) => {
      if (data.cost % 5 === 0) return data;
      throw new RequestError("Cost should be divided by 5 current value is: '${data.cost}'");
    },
  },
};
