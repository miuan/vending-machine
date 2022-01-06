import { Button, Modal } from "react-bootstrap";

export const ResetChangeModal = ({ change, onHide }) => (
  <Modal show={change} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Your change back</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {change &&
        Object.keys(change).map((ch) => (
          <div>
            {change[ch]}x <strong>{ch}c</strong>
          </div>
        ))}
    </Modal.Body>

    <Modal.Footer>
      <Button variant="primary" onClick={onHide}>
        Take change
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ResetChangeModal;
