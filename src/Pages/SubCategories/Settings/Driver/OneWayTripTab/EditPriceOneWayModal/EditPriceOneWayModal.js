import React, { useState, useEffect } from "react"; // Import useEffect to handle changes in initialData
import { TextField } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditPriceOneWayModal = ({ show, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
      duration: '',
      price: ''
    });
  
    useEffect(() => {
      if (initialData) {
        setFormData({
          duration: initialData.duration || '',
          price: initialData.price || ''
        });
      }
    }, [initialData]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSave = () => {
      if (formData.price <= 0) {
        toast.error("Price must be greater than 0.");
        return;
      }
      if (formData.duration <= 0) {
        toast.error("Duration must be greater than 0.");
        return;
      }
  
      onSave(formData);
      onClose();
    };
  
    if (!show) return null;
  
    return (
      <>
        <ToastContainer />
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Duration and Price</h2>
  
            <div className="form-group">
              <label htmlFor="edit-duration">Duration (hours):</label>
              <TextField
                id="edit-duration"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Enter duration in hours"
                fullWidth
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="edit-price">Price:</label>
              <TextField
                id="edit-price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                fullWidth
              />
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
                onClick={onClose}
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
  
  export default EditPriceOneWayModal;