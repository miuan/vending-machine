import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { buyProduct, selectDeposit } from "../../../../app/reducers/depositSlice";
import LowDepositErrorModal from "./LowDepositErrorModal";
import { ProductItem } from "./ProductItem";

export const Products = ({ products }) => {
  const dispatch = useAppDispatch();
  const [buyError, setBuyError] = useState({});
  const onBuy = useCallback(
    (product) => {
      dispatch(buyProduct(product))
        .unwrap()
        .catch((rejectedValue) => {
          setBuyError(rejectedValue);
        });
    },
    [dispatch]
  );

  const onHideError = useCallback(() => {
    setBuyError({});
  }, [setBuyError]);

  const deposit = useAppSelector(selectDeposit);

  return (
    <div>
      <div>
        {products.map((product, index) => (
          <ProductItem key={`product-${index}`} product={product} onBuy={onBuy} />
        ))}
      </div>
      <LowDepositErrorModal deposit={deposit} product={buyError} onHide={onHideError} />
    </div>
  );
};
