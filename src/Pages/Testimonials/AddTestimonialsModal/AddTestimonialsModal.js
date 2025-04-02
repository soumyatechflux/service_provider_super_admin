import React, { useState } from "react";
import { TextField } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AddTestimonialsModal = ({ show, onClose, addTestimonialToTable, getTestimonialsData }) => {
  const [formData, setFormData] = useState({
    name: "",
    comment: "",
    rating: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.comment || !formData.rating) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (formData.rating < 1 || formData.rating > 5) {
      toast.error("Rating must be between 1 and 5.");
      return;
    }

    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/cms/testimonials/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);

        const newTestimonial = response.data.data; // Assuming API returns new entry
        addTestimonialToTable(newTestimonial); // Update table immediately

        onClose();
        getTestimonialsData();
        setFormData({ name: "", comment: "", rating: "" });
      } else {
        toast.error(response.data.message || "Failed to add testimonial.");
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || "Error adding testimonial.";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", comment: "", rating: "" });
    onClose();
    getTestimonialsData();
  };

  if (!show) return null;

  return (
    <>
      <ToastContainer />
      <div className="modal-overlay">
        <div className="modal-content" style={{ height: "60%", overflowY: "auto" }}>
          <h2>Add Testimonial</h2>

          <div className="form-group">
            <TextField name="name" value={formData.name} onChange={handleChange} placeholder="Enter name" fullWidth />
          </div>

          <div className="form-group">
            <TextField name="comment" value={formData.comment} onChange={handleChange} placeholder="Enter description" fullWidth multiline rows={4} />
          </div>

          <div className="form-group">
            <TextField name="rating" type="number" value={formData.rating} onChange={handleChange} placeholder="Enter rating" fullWidth inputProps={{ min: 1, max: 5 }} />
          </div>

          <div className="modal-actions">
            <button onClick={handleSave} className="btn btn-primary" style={{ width: "100%" }}>Save</button>
            <button onClick={handleCancel} className="btn btn-secondary"style={{ width: "100%" }}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTestimonialsModal;
