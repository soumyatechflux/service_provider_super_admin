import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const EditTestimonialModal = ({ show, onClose, testimonialData, onUpdate, getTestimonialsData }) => {
  const [formData, setFormData] = useState({ id: "", name: "", comment: "", rating: "" });

  useEffect(() => {
    if (testimonialData) {
      setFormData({
        id: testimonialData.id || "",
        name: testimonialData.name || "",
        comment: testimonialData.comment || "",
        rating: testimonialData.rating || "",
      });
    }
  }, [testimonialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
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
      await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/cms/testimonials`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      toast.success("Testimonial updated successfully.");
      onUpdate(formData);
      onClose();
      getTestimonialsData();
    } catch (error) {
      console.error("Error updating testimonial:", error);
      toast.error("Error updating testimonial. Please try again.");
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!show) return null;

  return (
    <>
      <ToastContainer />
      <div className="modal-overlay">
        <div className="modal-content" style={{ height: "60%", overflowY: "auto" }}>
          <h2>Edit Testimonial</h2>

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
            <button onClick={handleUpdate} className="btn btn-primary" style={{ width: "100%" }}>Update</button>
            <button onClick={handleCancel} className="btn btn-secondary" style={{ width: "100%" }}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTestimonialModal;
