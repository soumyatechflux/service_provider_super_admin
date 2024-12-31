import React, { useState } from "react";
import { TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPartnerModal = ({ show, handleClose, onSave, getRestaurantTableData }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    country_code: "+91",
    mobile: "",
    email: "",
    years_of_experience: "",
    current_address: "",
    category_id: "", // No default category selected
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.mobile.match(/^\d{10}$/) || // Example phone validation
      !formData.years_of_experience ||
      !formData.category_id
    ) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }
  
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
      const response = await fetch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/partners/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            partner: {
              ...formData,
              years_of_experience: parseInt(formData.years_of_experience, 10),
              category_id: parseInt(formData.category_id, 10),
            },
          }),
        }
      );
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed.");
  
      toast.success("Partner registered successfully!");
  
      if (typeof onSave === "function") {
        onSave(data.partner); // Pass the saved partner data to the parent component.
      } else {
        console.error("onSave prop is not defined or is not a function.");
      }
  
      getRestaurantTableData();
      handleCancel();
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  
  const handleCancel = () => {
    setFormData({
      first_name: "",
      last_name: "",
      country_code: "+91",
      mobile: "",
      email: "",
      years_of_experience: "",
      current_address: "",
      category_id: "",
    });
    handleClose();
  };

  if (!show) return null;

  return (
    <>
      {/* <ToastContainer /> */}
      <div className="modal-overlay">
        <div className="modal-content" style={{ height: "80%", overflowY: "auto" }}>
          <h2>Register Partner</h2>

          <div className="form-group">
            <label htmlFor="first_name">First Name:</label>
            <TextField
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Enter first name"
              fullWidth
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Last Name:</label>
            <TextField
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Enter last name"
              fullWidth
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile:</label>
            <TextField
              id="mobile"
              name="mobile"
              type="tel"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              fullWidth
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email (optional):</label>
            <TextField
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              fullWidth
            />
          </div>

          <div className="form-group">
            <label htmlFor="years_of_experience">Years of Experience:</label>
            <TextField
              id="years_of_experience"
              name="years_of_experience"
              type="number"
              value={formData.years_of_experience}
              onChange={handleChange}
              placeholder="Enter years of experience"
              fullWidth
            />
          </div>

          <div className="form-group">
            <label htmlFor="current_address">Current Address (optional):</label>
            <TextField
              id="current_address"
              name="current_address"
              value={formData.current_address}
              onChange={handleChange}
              placeholder="Enter current address"
              fullWidth
            />
          </div>

          <div className="form-group">
            <label htmlFor="category_id">Category:</label>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
              >
                <MenuItem value={1}>Cook</MenuItem>
                <MenuItem value={2}>Driver</MenuItem>
                <MenuItem value={3}>Gardener</MenuItem>
              </Select>
            </FormControl>
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

export default AddPartnerModal;
