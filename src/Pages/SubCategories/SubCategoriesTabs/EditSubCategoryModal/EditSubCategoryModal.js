import { Box, Button, Modal, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditSubCategoryModal = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    subCategoryName: "",
    price: "",
    description: "",
    image: null, // For file upload
    imagePreview: "", // For storing the image preview URL
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        subCategoryName: initialData.sub_category_name || "",
        price: initialData.price || "",
        description: initialData.description || "",
        image: null, // Reset to null as file uploads are not prefilled
        imagePreview: initialData.image || "", // If there is an image, set the preview URL
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file), // Generate the preview URL
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );
  
      const payload = new FormData();
      payload.append("sub_category_id", initialData.id);  // sub_category_id from initialData
      payload.append("category_id", initialData.category_id);  // category_id from initialData
      payload.append("sub_category_name", formData.subCategoryName);
      payload.append("price", formData.price);
      payload.append("description", formData.description);
      if (formData.image) {
        payload.append("image", formData.image);
      }
  
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/sub_category`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response?.status === 200 && response?.data?.success) {
        toast.success("Sub-category updated successfully.");
        onSubmit(); // Refresh the parent data
        onClose(); // Close the modal
      } else {
        toast.error(response?.data?.message || "Failed to update sub-category.");
      }
    } catch (error) {
      toast.error("Error updating sub-category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <h2 style={{color:"black"}}>Edit Sub-Category</h2>

        {/* Sub-Category Name */}
        <TextField
          id="subCategoryName"
          name="subCategoryName"
          label="Sub-Category Name"
          value={formData.subCategoryName}
          onChange={handleChange}
          fullWidth
          margin="dense"
          variant="outlined"
        />

        {/* Price */}
        <TextField
          id="price"
          name="price"
          label="Price"
          value={formData.price}
          onChange={handleChange}
          fullWidth
          margin="dense"
          variant="outlined"
        />

        {/* Description */}
        <TextField
          id="description"
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
          margin="dense"
          variant="outlined"
        />

        {/* Image Upload */}
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleFileChange}
          accept="image/*"
          style={{ marginTop: "16px", marginBottom: "16px", display: "block" }}
        />
        
        {/* Display image preview if available */}
        {formData.imagePreview && (
          <Box sx={{ mt: 2, mb: 2, textAlign: "center" }}>
            <img
              src={formData.imagePreview}
              alt="Image Preview"
              style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
            />
          </Box>
        )}

        {/* Actions */}
        <div className="modal-actions">
          <button
            onClick={handleSubmit}
            className="btn btn-primary" style={{width:"100%"}}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={onClose}
            className="btn btn-secondary" style={{width:"100%"}}
          >
            Cancel
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default EditSubCategoryModal;
