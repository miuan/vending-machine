import { Button, Modal } from "react-bootstrap";

export const LowDepositErrorModal = ({ deposit, product, onHide }) => (
  <Modal show={product.id} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Your balance is low</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      To buy product with name <strong>{product.name}</strong> you need deposit at least {product.cost}. You currently have {deposit}
    </Modal.Body>

    <Modal.Footer>
      <Button variant="primary" onClick={onHide}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
);

export default LowDepositErrorModal;
