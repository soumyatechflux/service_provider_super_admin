import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditDescriptionModal = ({ show, onClose, initialData, fetchCategoryData }) => {
  const [formData, setFormData] = useState({
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData.description) {
      toast.error("Description cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

      // Prepare the payload with category_id and description
      const payload = {
        category_id: initialData.id,
        description: formData.description,
      };

      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/category`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200) {
        toast.success("Category updated successfully!");
        await fetchCategoryData();
        onClose();
      } else {
        throw new Error(response.data?.message || "Failed to update the category.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "An error occurred while updating the category.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Edit Category Description</h2>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a description"
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div className="modal-actions">
            <button
              onClick={handleSave}
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%" }}
            >
              Save
            </button>
            <button onClick={onClose} className="btn btn-secondary" style={{ width: "100%" }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default EditDescriptionModal;
