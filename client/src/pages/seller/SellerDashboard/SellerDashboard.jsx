import React from "react";
import { Link } from "react-router-dom";

export function SellerDashboard() {
  return (
    <div className="Editor">
      <h2>Seller Dashboard</h2>
      <div>
        <Link to="/seller/api/product-manager">Product manager (api)</Link>
      </div>
      <Link to="/seller/gql/product-manager">Product manager (grapqh)</Link>
    </div>
  );
}

export default SellerDashboard;
