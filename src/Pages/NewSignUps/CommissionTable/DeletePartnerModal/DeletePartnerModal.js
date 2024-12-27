import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeletePartnerModal = ({ show, handleClose, handleDelete, partner }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete partner <strong>{partner.name}</strong>? This action cannot be
        undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            handleDelete(partner);
            handleClose(); // Close the modal after triggering the delete
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeletePartnerModal;
