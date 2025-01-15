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
    category_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateFields = () => {
    const { first_name, last_name, mobile, email, years_of_experience, current_address, category_id } = formData;
    if (!first_name || first_name.trim() === "") {
      toast.error("First Name is required.");
      return false;
    }
    if (!last_name || last_name.trim() === "") {
      toast.error("Last Name is required.");
      return false;
    }
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      toast.error("Enter a valid 10-digit mobile number.");
      return false;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email address.");
      return false;
    }
    if (!years_of_experience || isNaN(years_of_experience) || years_of_experience <= 0) {
      toast.error("Years of Experience must be a positive number.");
      return false;
    }
    
    if (!category_id) {
      toast.error("Category is required.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateFields()) return;
  
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
  
      // Check if the API responded with success: false
      if (data.success === false) {
        toast.error(data.message || "An error occurred while registering the partner.");
        return; // Stop further execution as registration failed
      }
  
      // Success flow
      toast.success("Partner registered successfully!");
  
      if (typeof onSave === "function") {
        onSave(data.partner); // Pass the saved partner data to the parent component.
      }
  
      getRestaurantTableData();
      handleCancel();
    } catch (error) {
      // General error handling
      toast.error(error.message || "Failed to register partner. Please try again.");
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
      <ToastContainer />
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
              required
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
              required
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
              required
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
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="current_address">Current Address:</label>
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
            <FormControl fullWidth required>
              
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
            <button onClick={handleSave} className="btn btn-primary" style={{width:"100%"}}>
              Save
            </button>
            <button onClick={handleCancel} className="btn btn-secondary"  style={{width:"100%"}}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPartnerModal;
