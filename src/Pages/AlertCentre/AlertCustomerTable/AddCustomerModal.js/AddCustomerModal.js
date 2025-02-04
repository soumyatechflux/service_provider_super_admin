
import { TextField } from "@mui/material";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCustomerModal = ({ show, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    notification_type: "",  // Added this field as a text input
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.message || !formData.notification_type) {
      toast.error("Please fill in all fields.");
      return;
    }
  
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
  
    if (!token) {
      toast.error("Token not found. Please log in again.");
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/firebase/send_notification/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          body: formData.message,
          notification_type: formData.notification_type,  // Include notification_type in request body
        }),
      });
  
      const data = await response.json();
      console.log("Full response data:", data);  // Log the response for debugging
  
      if (!response.ok) {
        throw new Error("Failed to send notification");
      }
  
      if (data.success) {
        // Check if any valid message IDs were returned (not null)
        const successfulMessages = data.data.filter((messageId) => messageId !== null);
  
        if (successfulMessages.length > 0) {
          // Show success message
          toast.success("Notification sent successfully!");
          onSave(formData);  // Assuming onSave handles saving the customer data
          setFormData({ title: "", message: "", notification_type: "" }); // Clear fields after success
          onClose();
        } else {
          toast.error("No valid tokens found for sending notifications.");
        }
      } else {
        toast.error("Failed to send notification.");
      }
    } catch (error) {
      toast.error("An error occurred: " + error.message);
    }
  };
  
  const handleCancel = () => {
    setFormData({ title: "", message: "", notification_type: "" }); // Reset fields
    onClose();
  };

  if (!show) return null;

  return (
    <>
      <ToastContainer />
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Add Notification</h2>
          
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <TextField
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
              fullWidth
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <TextField
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter message"
              fullWidth
              multiline
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="notification_type">Notification Type:</label>
            <TextField
              id="notification_type"
              name="notification_type"
              value={formData.notification_type}
              onChange={handleChange}
              placeholder="Enter notification type (e.g. offers, alerts, etc.)"
              fullWidth
            />
          </div>

          <div className="modal-actions">
            <button onClick={handleSave} className="btn btn-primary" style={{ width: "100%" }}>
              Send
            </button>
            <button onClick={handleCancel} className="btn btn-secondary" style={{ width: "100%" }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCustomerModal;
