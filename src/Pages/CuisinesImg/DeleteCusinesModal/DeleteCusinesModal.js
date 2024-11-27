import React from "react";
import { Modal, Button } from "react-bootstrap";

function DeleteCusinesModal({ show, handleClose, handleDelete }) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this Cuisine?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          No
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Yes, Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteCusinesModal;
