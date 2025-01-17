import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const EditFAQModal = ({ show, onClose, onSave, faq, categoryID, fetchFAQs }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (faq) {
      setQuestion(faq.question);
      setAnswer(faq.answer);
    } else {
      setQuestion("");
      setAnswer("");
    }
  }, [faq, show]);

  const handleSave = async () => {
    if (!question || !answer) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/cms/faqs`,
        {
          category_id: categoryID,
          faq_id: faq.faq_id,
          question,
          answer,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data?.success) {
        toast.success("FAQ updated successfully!");
        onSave(response.data);
        onClose();
        fetchFAQs();
      } else {
        toast.error(response.data.message || "Failed to update FAQ.");
      }
    } catch (error) {
      console.error("Error updating FAQ:", error.response?.data);
      toast.error("Failed to update FAQ. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setQuestion("");
    setAnswer("");
    onClose();
  };

  return (
    <Modal open={show} onClose={handleCancel}>
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
          }}
        >
          <h2>Edit FAQ</h2>
          <TextField
            label="Question"
            fullWidth
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ marginBottom: "15px" }}
          />
          <TextField
            label="Answer"
            fullWidth
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <div className="modal-actions">
            <button
              onClick={handleSave}
              type="button"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              type="button"
              className="btn btn-secondary"
              disabled={loading}
              style={{ width: "100%" }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditFAQModal;
