import { TextField, Checkbox, FormControlLabel } from "@mui/material";
import React, { useState } from "react";
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
    is_first_time_use: false, // ✅ New checkbox field
    is_one_time_use: false, // ✅ New checkbox field
  });

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: type === "checkbox" ? checked : value,
  //   });
  // };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      let newValue = value;
  
      // Prevent leading zero when user enters numbers
      if (name === "price") {
        newValue = newValue.replace(/^0+(?=\d)/, ""); // Remove leading zeros except for "0" alone
  
        // Ensure "price" does not exceed 100 if Discount Type is "percentage"
        if (formData.sub_category_name === "percentage" && newValue !== "") {
          newValue = Math.min(100, parseFloat(newValue) || "");
        }
      }
  
      setFormData({
        ...formData,
        [name]: newValue,
      });
    }
  };
  
  

  const handleSave = async () => {
    const currentDate = new Date().toISOString().split("T")[0];
  
    // Validation for empty fields
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
  
    // Ensure price is greater than 0
    if (formData.price <= 0) {
      toast.error("Discount value must be greater than 0.");
      return;
    }
  
    // If discount type is "percentage", ensure value is not more than 100
    if (formData.sub_category_name === "percentage" && formData.price > 100) {
      toast.error("Discount value cannot be more than 100.");
      return;
    }
  
    // Ensure limit is greater than 0
    // if (formData.limit <= 0) {
    //   toast.error("Usage limit must be greater than 0.");
    //   return;
    // }
  
    // Ensure start date is not in the past
    if (formData.start_date < currentDate) {
      toast.error("Start date cannot be in the past.");
      return;
    }
  
    // Ensure end date is after start date
    if (formData.end_date <= formData.start_date) {
      toast.error("End date must be later than start date.");
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
        is_first_time_use: formData.is_first_time_use, // ✅ Added
        is_one_time_use: formData.is_one_time_use, // ✅ Added
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
  
      const data = await response.json();
  
      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Failed to save the discount.");
      }
  
      toast.success(data.message || "Discount added successfully!");
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
        is_first_time_use: false,
        is_one_time_use: false,
      });
  
      onClose();
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(error.message || "Failed to save the discount. Please try again.");
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
      is_first_time_use: false,
      is_one_time_use: false,
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

          {/* ✅ Added checkboxes */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Checkbox
              checked={formData.is_first_time_use}
              onChange={handleChange}
              name="is_first_time_use"
            />
            <span>Only First Time Booking</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Checkbox
              checked={formData.is_one_time_use}
              onChange={handleChange}
              name="is_one_time_use"
            />
            <span>One Time Use</span>
          </div>

          <div className="modal-actions">
            <button
              onClick={handleSave}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="btn btn-secondary"
              style={{ width: "100%" }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDiscountModal;
