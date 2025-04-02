import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";

const DeleteTestimonialModal = ({ show, onClose, onConfirm, testimonialId }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

      const response = await axios.delete(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/cms/testimonials/${testimonialId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      if (response?.status === 200 && response?.data?.success) {
        toast.success("Testimonial deleted successfully!");
        onConfirm(testimonialId);
      } else {
        toast.error(response.data.message || "Failed to delete testimonial.");
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred while deleting the testimonial. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete this testimonial? This action cannot be undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteTestimonialModal;
