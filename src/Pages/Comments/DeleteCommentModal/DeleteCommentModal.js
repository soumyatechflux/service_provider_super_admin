import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

const DeleteCommentModal = ({ show, handleClose, handleDelete, comment }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await handleDelete(comment.id); // Pass the comment ID to the delete handler
    } finally {
      setLoading(false);
      handleClose(); // Close the modal after deletion
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete the comment by{" "}
        <b>{comment?.user_name || "this user"}</b>? This action cannot be undone.
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

export default DeleteCommentModal;
