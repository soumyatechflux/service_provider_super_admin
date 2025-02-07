import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteCustomerModal = ({ show, handleClose, handleDelete, customer }) => {
  const handleConfirmDelete = async () => {
    if (!customer) return;

    try {
      await handleDelete(customer); // Ensure the API call is successful before closing
      handleClose(); // Close modal only after deletion is confirmed
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete customer{" "}
        <strong>{customer?.name || "this customer"}</strong>? This action cannot be undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirmDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteCustomerModal;
