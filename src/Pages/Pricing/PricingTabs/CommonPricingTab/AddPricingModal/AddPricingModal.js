import React, { useState } from "react";
import { TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material"; // Import Material-UI components

const AddPricingModal = ({ show, onClose, onSave, subCategoryOptions }) => {
  const [formData, setFormData] = useState({
    sub_category_name: "",
    price: "",
    number_of_people: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (
      !formData.sub_category_name ||
      !formData.price ||
      !formData.number_of_people ||
      !formData.description
    ) {
      alert("Please fill in all fields.");
      return;
    }
    onSave(formData); // Pass the formData to parent component
    setFormData({ sub_category_name: "", price: "", number_of_people: "", description: "" }); // Reset formData after saving
    onClose(); // Close the modal
  };

  const handleCancel = () => {
    setFormData({ sub_category_name: "", price: "", number_of_people: "", description: "" }); // Reset formData on cancel
    onClose(); // Close the modal
  };

  if (!show) return null; // Return null if modal is not visible

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Pricing</h2>

        {/* Sub-Category Name Field (Dropdown) */}
        <div className="form-group">
          <FormControl fullWidth>
            <InputLabel id="sub-category-name-label">Sub-Category Name</InputLabel>
            <Select
              labelId="sub-category-name-label"
              id="sub-category-name"
              name="sub_category_name"
              value={formData.sub_category_name}
              onChange={handleChange}
            >
              {subCategoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Price Field */}
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <TextField
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            fullWidth
          />
        </div>

        {/* Number of People Field */}
        <div className="form-group">
          <label htmlFor="number-of-people">Number of People:</label>
          <TextField
            id="number-of-people"
            name="number_of_people"
            type="number"
            value={formData.number_of_people}
            onChange={handleChange}
            placeholder="Enter number of people"
            fullWidth
          />
        </div>

        {/* Description Field */}
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <TextField
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            multiline
            rows={3}
            fullWidth
          />
        </div>

        {/* Modal Actions */}
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
  );
};

export default AddPricingModal;
