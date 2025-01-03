import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const EditSubCategoryModal = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    subCategoryName: "",
    price: "",
    description: "",
    image: null, // For file upload
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        subCategoryName: initialData.sub_category_name || "",
        price: initialData.price || "",
        description: initialData.description || "",
        image: null, // Reset to null as file uploads are not prefilled
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
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
        <h2>Edit Sub-Category</h2>

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

        {/* Image */}
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleFileChange}
          accept="image/*"
          style={{ marginTop: "16px", marginBottom: "16px", display: "block" }}
        />

        {/* Actions */}
        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            onClick={onClose}
            variant="contained"
            color="error"
            style={{ marginLeft: 8 }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditSubCategoryModal;
