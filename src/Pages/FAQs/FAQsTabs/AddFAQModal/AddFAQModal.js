import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { Button, TextField, CircularProgress } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const AddFAQModal = ({ show, onClose, onSave, categoryID,fetchFAQs }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!question || !answer) {
        toast.error("Please fill in all fields.");
        return;
    }

    setLoading(true);

    try {
        const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
        const payload = {
            category_id: categoryID, // Ensure categoryID is passed correctly
            question,
            answer,
        };

        const response = await axios.post(
            `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/cms/faqs/add`,
            payload,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (response?.data?.success) {
            toast.success("FAQ added successfully!");
            onSave(response.data); // Pass the newly created FAQ to the parent component
            setQuestion(""); // Clear the question field
            setAnswer(""); // Clear the answer field
            onClose();
            fetchFAQs(); // Refresh FAQs list
        } else {
            toast.error(response.data.message || "Failed to add FAQ.");
        }
    } catch (error) {
        console.error("Error adding FAQ:", error.response?.data);
        toast.error("Failed to add FAQ. Please try again.");
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
          }}
        >
          <h2>Add FAQ</h2>
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
            multiline
            rows={4}
          />
          <div className="modal-actions" style={{ marginTop: "15px" }}>
            <button
              onClick={handleSave}
                 type="button"
                className="btn btn-primary"
            >
              {loading ? <CircularProgress size={24} /> : "Save"}
            </button>
            <button
              onClick={onClose}
              type="button"
              className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddFAQModal;
