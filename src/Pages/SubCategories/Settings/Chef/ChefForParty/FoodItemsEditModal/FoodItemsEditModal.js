import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FoodItemsEditModal = ({ show, onClose, foodItem, onSave,fetchSubCategoryData }) => {
  const [formData, setFormData] = useState({ name: "", price: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (foodItem) {
      setFormData({
        name: foodItem.name || "",
        price: foodItem.price || "",
      });
    }
  }, [foodItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Food item name is required.");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error("Price must be greater than 0.");
      return;
    }

    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

    setLoading(true);
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/menu`,
        {
          menu_id: foodItem.id, // Ensure `id` exists in `foodItem`
          name: formData.name,
          price: parseFloat(formData.price), // Ensure price is a number
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Menu item updated successfully!");
        onSave(response.data); // Pass the updated item back to the parent component
        onClose();
        fetchSubCategoryData()
      } else {
        toast.error("Failed to update menu item.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred while updating the menu item."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Edit Food Item</h2>
          <div className="form-group">
            <label htmlFor="food-item-name">Food Item Name:</label>
            <input
              id="food-item-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter food item name"
              style={{ width: "100%", padding: "8px" }}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="food-item-price">Price:</label>
            <input
              id="food-item-price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              style={{ width: "100%", padding: "8px" }}
              disabled={loading}
            />
          </div>
          <div className="modal-actions">
            <button
              onClick={handleSave}
              className="btn btn-primary"
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ width: "100%" }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default FoodItemsEditModal;
