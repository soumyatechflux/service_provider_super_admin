import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

const DeletePricingModal = ({ show, handleClose, handleDelete, subCategory }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await handleDelete(); // Call delete handler
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete the sub-category{" "}
        <b>{subCategory?.sub_category_name || "this item"}</b>? This action cannot be undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirmDelete} disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" /> : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeletePricingModal;
