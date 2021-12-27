import React, { useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useApiGet } from "../../../app/api-hooks";
import Loading from "../../../components/Loading/Loading";

import "./UserDashboard.css";

const Product = ({ product }) => {
  return (
    <div className="Product">
      <span className="Product-name">{product.productName}</span>
      <span className="Product-cost">{product.cost}c</span>
      <Button>Buy me!</Button>
    </div>
  );
};

const Table = ({ products }) => {
  return (
    <div>
      {products.map((p) => (
        <Product product={p} />
      ))}
    </div>
  );
};

const Credit = () => {
  const [credit, setCredit] = useState(0);

  const addCredit = (add) => () => {
    setCredit(credit + add);
  };

  return (
    <div className="Credit">
      <h2>Credit: {credit}</h2>
      {[5, 10, 20, 50, 100].map((c) => (
        <Button variant="success" onClick={addCredit(c)}>
          {c}c
        </Button>
      ))}
      <Button variant="danger" onClick={() => setCredit(0)}>
        Back
      </Button>
    </div>
  );
};

const filter = { amountAvailable_gt: 0 };

export function UserDashboard() {
  const [data, setData] = useState();
  const { refetch, loading } = useApiGet(`/api/product/all`, {
    onCompleted: (d) => {
      const dataFields = Object.getOwnPropertyNames(d);
      if (dataFields.length > 0 && d[dataFields[0]].length > 0) {
        setData(d[dataFields[0]]);
      } else {
        setData([]);
      }
    },
    variables: { filter },
  });

  return (
    <div className="Editor">
      <Credit />
      <h2>Available products</h2>
      {loading ? <Loading /> : <Table products={data || []} />}
    </div>
  );
}

export default UserDashboard;
