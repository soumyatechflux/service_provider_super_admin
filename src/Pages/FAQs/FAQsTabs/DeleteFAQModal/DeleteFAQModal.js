import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../Loader/Loader";

const DeleteFAQModal = ({ show, onClose, onDelete, faq }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/cms/faqs/${faq.faq_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data?.success) {
        toast.success("FAQ deleted successfully!");
        onDelete(faq.faq_id); // Notify parent to remove FAQ from the list
        onClose();
      } else {
        toast.error(response.data.message || "Failed to delete FAQ.");
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error.response?.data);
      toast.error("Failed to delete FAQ. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={show} onClose={onClose}>
      <div
        className="modal-overlay"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <div
          className="modal-content"
          style={{
            padding: "20px",
            maxWidth: "600px",
            backgroundColor: "white",
            borderRadius: "8px",
            overflowY: "auto",
            position: "relative",
          }}
        >
          {loading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                zIndex: 10,
              }}
            >
              <Loader />
            </div>
          )}
          <h2>Delete FAQ</h2>
          <p>
            Are you sure you want to delete the FAQ: <b>{faq?.question}</b>?
          </p>
          <div className="modal-actions">
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={loading}
            >
              Delete
            </Button>
            <Button
              onClick={onClose}
              variant="outlined"
              color="secondary"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteFAQModal;
