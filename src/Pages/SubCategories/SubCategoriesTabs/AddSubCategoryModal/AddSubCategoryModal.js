import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const AddSubCategoryModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  category_id,
}) => {
  const [formData, setFormData] = useState({
    subCategoryName: "",
    price: "",
    description: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        subCategoryName: initialData.sub_category_name || "",
        price: initialData.price || "",
        description: initialData.description || "",
        image: null,
      });
    } else {
      resetFormData();
    }
  }, [initialData]);

  const resetFormData = () => {
    setFormData({
      subCategoryName: "",
      price: "",
      description: "",
      image: null,
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.subCategoryName) {
      toast.warning("Please enter the sub-category name.");
      return;
    }
    if (!formData.price) {
      toast.warning("Please enter the price.");
      return;
    }
    if (!formData.description) {
      toast.warning("Please enter a description.");
      return;
    }
    if (!formData.image) {
      toast.warning("Please upload an image.");
      return;
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );

      const payload = new FormData();
      payload.append("category_id", category_id);
      payload.append("sub_category_name", formData.subCategoryName);
      payload.append("price", formData.price);
      payload.append("description", formData.description);
      payload.append("image", formData.image);

      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/sub_category/add`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        toast.success("Sub-category added successfully!");
        onSubmit();
        onClose();
        resetFormData();
      } else {
        toast.error(response.data.message || "Failed to add sub-category.");
      }
    } catch (error) {
      toast.error(
        "An error occurred while adding the sub-category. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    toast.info("Action canceled.");
    resetFormData();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleCancel}>
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
        <h2>{initialData ? "Edit Sub-Category" : "Add Sub-Category"}</h2>

        {/* Sub-Category Name */}
        <label htmlFor="subCategoryName" style={{ fontWeight: "bold" }}>
          Sub-Category Name
        </label>
        <TextField
          id="subCategoryName"
          name="subCategoryName"
          placeholder="Enter Name of Sub Category"
          value={formData.subCategoryName}
          onChange={handleChange}
          fullWidth
          margin="dense"
          variant="outlined"
        />

        {/* Price */}
        <label htmlFor="price" style={{ fontWeight: "bold" }}>
          Price
        </label>
        <TextField
          id="price"
          name="price"
          placeholder="Enter Price"
          value={formData.price}
          onChange={handleChange}
          fullWidth
          margin="dense"
          variant="outlined"
        />

        {/* Description */}
        <label htmlFor="description" style={{ fontWeight: "bold" }}>
          Description
        </label>
        <TextField
          id="description"
          name="description"
          placeholder="Enter Description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          margin="dense"
          variant="outlined"
        />

        {/* Image Upload */}
        <label htmlFor="image" style={{ fontWeight: "bold" }}>
          Image
        </label>
        <TextField
          id="image"
          name="image"
          type="file"
          onChange={handleChange}
          fullWidth
          margin="dense"
          variant="outlined"
          inputProps={{ accept: "image/*" }}
        />

        {/* Actions */}
        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Saving..." : initialData ? "Save Changes" : "Add"}
          </Button>
          <Button
            onClick={handleCancel}
            variant="contained"
            color="error"
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddSubCategoryModal;
