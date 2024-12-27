import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";

const EditSettingModal = ({ show, onClose, onSave, selectedSetting }) => {
  const [formData, setFormData] = useState({
    config_key: "",
    config_value: "",
    description: "",
  });

  useEffect(() => {
    if (selectedSetting) {
      setFormData({
        config_key: selectedSetting.config_key || "",
        config_value: selectedSetting.config_value || "",
        description: selectedSetting.description || "",
      });
    }
  }, [selectedSetting]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (
      !formData.config_key ||
      !formData.config_value ||
      !formData.description
    ) {
      alert("Please fill in all fields.");
      return;
    }
    onSave({
      config_id: selectedSetting.config_id,
      config_value: formData.config_value,
      description: formData.description,
    });
  };
  
  const handleCancel = () => {
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Setting</h2>
        <div className="form-group">
          <label htmlFor="config_key">Title:</label>
          <TextField
            id="config_key"
            name="config_key"
            value={formData.config_key}
            onChange={handleChange}
            fullWidth
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="config_value">Value:</label>
          <TextField
            id="config_value"
            name="config_value"
            value={formData.config_value}
            onChange={handleChange}
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
            multiline
            rows={3}
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
  );
};

export default EditSettingModal;
