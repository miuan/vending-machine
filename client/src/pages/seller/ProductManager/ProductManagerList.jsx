import { loader } from "graphql.macro";
import React from "react";
import FilteredList from "../../../components/List/FilteredList";

const USER_LIST_QUERY = loader("./graphql/product-all-seller.gql");
const ADMIN_LIST_QUERY = loader("./graphql/product-all-admin.gql");
const DELETE_MUTATION = loader("./graphql/mutation-remove-product.gql");

export const ProductManagerList = ({ userId, adminMode = false, api }) => {
  return (
    <div>
      {api ? (
        <FilteredList
          name={"Product api"}
          fields={["productName", "cost", "amountAvailable"]}
          userId={userId}
          adminMode={adminMode}
          createLink={"/seller/api/product-manager/create"}
          getEditLink={(i) => `/seller/api/product-manager/${i.id}`}
          apiUrl={"/api/product"}
        />
      ) : (
        <FilteredList
          name={"Product gql"}
          fields={["productName", "cost", "amountAvailable"]}
          userId={userId}
          adminMode={adminMode}
          queries={{ USER_LIST_QUERY, ADMIN_LIST_QUERY, DELETE_MUTATION }}
          createLink={"/seller/gql/product-manager/create"}
          getEditLink={(i) => `/seller/gql/product-manager/${i.id}`}
        />
      )}
    </div>
  );
};

export default ProductManagerList;
