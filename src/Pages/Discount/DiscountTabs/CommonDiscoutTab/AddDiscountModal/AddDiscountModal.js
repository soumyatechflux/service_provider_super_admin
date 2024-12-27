import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddDiscountModal = ({ show, onClose, onSave, fetchDiscountData }) => {
  const [formData, setFormData] = useState({
    sub_category_name: "",
    price: "",
    limit: "",
    minimum_price: "",
    discount_code: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (
      !formData.sub_category_name ||
      !formData.price ||
      !formData.limit ||
      !formData.minimum_price ||
      !formData.discount_code ||
      !formData.description ||
      !formData.start_date ||
      !formData.end_date
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

    const payload = {
      discount: {
        voucher_code: formData.discount_code,
        discount_type: formData.sub_category_name,
        discount_value: parseFloat(formData.price),
        minimum_order_amount: parseFloat(formData.minimum_price),
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        usage_limit: parseInt(formData.limit, 10),
        description: formData.description,
      },
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/discount/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save the discount.");
      }

      const data = await response.json();
      console.log("Discount added successfully:", data);

      toast.success("Discount added successfully!");
      onSave(data);
      fetchDiscountData();

      setFormData({
        sub_category_name: "",
        price: "",
        limit: "",
        minimum_price: "",
        discount_code: "",
        description: "",
        start_date: "",
        end_date: "",
      });

      onClose();
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Failed to save the discount. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData({
      sub_category_name: "",
      price: "",
      limit: "",
      minimum_price: "",
      discount_code: "",
      description: "",
      start_date: "",
      end_date: "",
    });
    onClose();
  };

  if (!show) return null;

  return (
    <>
      <ToastContainer />
      <div className="modal-overlay">
        <div
          className="modal-content"
          style={{ height: "80%", overflowY: "auto" }}
        >
          <h2>Add Discount</h2>

          <div className="form-group">
            <label htmlFor="sub-category-name">Discount Type:</label>
            <select
              id="sub-category-name"
              name="sub_category_name"
              value={formData.sub_category_name}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Select discount type</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="discount-price">Discount Value:</label>
            <TextField
              id="discount-price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter discount value"
              fullWidth
            />
          </div>

          <div className="form-group">
            <label htmlFor="limit">Usage Limit:</label>
            <TextField
              id="limit"
              name="limit"
              type="number"
              value={formData.limit}
              onChange={handleChange}
              placeholder="Enter usage limit"
              fullWidth
            />
          </div>

          <div className="form-group">
            <label htmlFor="minimum-price">Minimum Price:</label>
            <TextField
              id="minimum-price"
              name="minimum_price"
              type="number"
              value={formData.minimum_price}
              onChange={handleChange}
              placeholder="Enter minimum price"
              fullWidth
            />
          </div>

          <div className="form-group">
            <label htmlFor="discount-code">Voucher Code:</label>
            <TextField
              id="discount-code"
              name="discount_code"
              value={formData.discount_code}
              onChange={handleChange}
              placeholder="Enter voucher code"
              fullWidth
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <TextField
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              fullWidth
            />
          </div>

          <div className="form-group">
            <label htmlFor="start-date">Start Date:</label>
            <TextField
              id="start-date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              fullWidth
            />
          </div>

          <div className="form-group">
            <label htmlFor="end-date">End Date:</label>
            <TextField
              id="end-date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              fullWidth
            />
          </div>

          <div className="modal-actions">
            <button onClick={handleSave} className="btn btn-primary">
              Save
            </button>
            <button onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDiscountModal;
