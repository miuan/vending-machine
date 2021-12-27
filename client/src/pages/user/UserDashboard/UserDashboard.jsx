import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { depositInitializing, loadUserDeposit } from "../../../app/reducers/depositSlice";
import { loadAllProducts, loadedProducts, loadingProducts } from "../../../app/reducers/productsSlice";
import Loading from "../../../components/Loading/Loading";
import { CreditPanel } from "./Components/CreditPanel";
import { Products } from "./Components/Products";

import "./UserDashboard.css";

const filter = { amountAvailable_gt: 0 };

export function UserDashboard() {
  const dispatch = useAppDispatch();
  const initializing = useAppSelector(depositInitializing);
  const loading = useAppSelector(loadingProducts);
  const products = useAppSelector(loadedProducts);

  useEffect(() => {
    dispatch(loadUserDeposit());
    dispatch(loadAllProducts(filter));
  }, [dispatch]);

  return (
    <div className="Editor">
      {!initializing && <CreditPanel />}
      <h2>Available products</h2>
      {loading ? <Loading /> : <Products products={products || []} />}
    </div>
  );
}

export default UserDashboard;
