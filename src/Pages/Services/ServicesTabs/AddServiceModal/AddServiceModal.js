import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const AddServiceModal = ({ show, onClose, onSave, categoryId, subCategoryId, fetchServices }) => {
  const [title, setTitle] = useState("");
  const [services, setServices] = useState("");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(""); // New state for URL
  const [subCategory, setSubCategory] = useState(subCategoryId); // New state for sub-category ID (editable now)

  const [errors, setErrors] = useState({}); // State to track form validation errors

  const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

  // Reset form data when modal is opened
  useEffect(() => {
    if (show) {
      setTitle("");
      setServices("");
      setImage(null);
      setUrl("");
      setSubCategory(subCategoryId);
      setErrors({}); 
    }
  }, [show, subCategoryId]);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const validateForm = () => {
    const errors = {};
    if (!title) errors.title = "Service title is required";
    if (!services) errors.services = "Description is required";
    if (!image) errors.image = "Image is required";
    if (!url) errors.url = "URL is required";
    if (!subCategory) errors.subCategory = "Sub-category ID is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", services);
    formData.append("image", image);
    formData.append("category_id", categoryId);
    formData.append("sub_category_id", subCategory); // Include sub-category ID
    formData.append("url", url); // Add URL to form data

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/cms/services/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Service added successfully!");
        onSave(response.data.data);
        fetchServices();
        onClose(); 
      } else {
        toast.error(response.data.message || "Failed to add service.");
      }
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error("An error occurred while adding the service.");
    }
  };

  return (
    <Modal open={show} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <div className="modal-overlay" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
        <div className="modal-content" style={{ padding: "20px", maxWidth: "600px", backgroundColor: "white", borderRadius: "8px", overflowY: "auto" }}>
          <h2 id="modal-title" style={{ textAlign: "center" }}>Add Service</h2>

          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label htmlFor="title" style={{ fontWeight: "bold" }}>Service Title :</label>
            <TextField
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="Enter service title"
              error={!!errors.title}
              helperText={errors.title}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label htmlFor="services" style={{ fontWeight: "bold" }}>Description :</label>
            <textarea
              id="services"
              name="services"
              value={services}
              onChange={(e) => setServices(e.target.value)}
              style={{ width: "100%", height: "100px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="Enter service description"
            />
            {errors.services && <div style={{ color: "red", fontSize: "12px" }}>{errors.services}</div>}
          </div>

          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label htmlFor="image" style={{ fontWeight: "bold" }}>Select Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "block", width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
            {errors.image && <div style={{ color: "red", fontSize: "12px" }}>{errors.image}</div>}
          </div>

          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label htmlFor="url" style={{ fontWeight: "bold" }}>URL :</label>
            <TextField
              id="url"
              name="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="Enter URL"
              error={!!errors.url}
              helperText={errors.url}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label htmlFor="subCategoryId" style={{ fontWeight: "bold" }}>Sub-Category ID :</label>
            <TextField
              id="subCategoryId"
              name="subCategoryId"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="Enter Sub-Category ID"
              error={!!errors.subCategory}
              helperText={errors.subCategory}
            />
          </div>

          <div className="modal-actions">
            <button onClick={handleSave} type="button" className="btn btn-primary">Save</button>
            <button onClick={onClose} type="button" className="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddServiceModal;
