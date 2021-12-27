import { Button } from "react-bootstrap";

export const ProductItem = ({ product, onBuy }) => {
  return (
    <div className="Product">
      <span className="Product-available">{product.amountAvailable}x</span>
      <span className="Product-name">{product.name}</span>
      <span className="Product-cost">{product.cost}c</span>
      <Button onClick={() => onBuy(product)} disabled={!product.amountAvailable}>
        Buy me!
      </Button>
    </div>
  );
};
