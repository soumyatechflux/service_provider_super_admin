import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";

const EditRefundAndCancellationModal = ({ show, onClose, bookingId, refundAmount, isRefunded, getRefundData }) => {
  const [loading, setLoading] = useState(false);

  const handleRefund = async () => {
    if (!bookingId) {
      toast.error("Booking ID is missing!");
      return;
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

      const payload = {
        booking_id: bookingId, 
        is_refund: isRefunded === 1 ? 0 : 1,
      };

      console.log("Sending PATCH request with payload:", payload); 

      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/refunds`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLoading(false);

      if (response.status === 200 && response.data.success) {
        toast.success("Refund status updated successfully!");
        getRefundData(); 
        onClose(); 
      } else {
        toast.error(response.data.message || "Failed to update refund status.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Refund API Error:", error);
      toast.error("An error occurred while processing the refund. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title>Confirm Refund</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to process the refund?</p>
        <p><strong>Refund Amount:</strong> ₹{refundAmount}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleRefund} disabled={loading}>
          {loading ? "Processing..." : "Yes, Refund"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditRefundAndCancellationModal;
