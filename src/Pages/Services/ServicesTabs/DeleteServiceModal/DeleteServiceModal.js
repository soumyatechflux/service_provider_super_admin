import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DeleteServiceModal = ({ show, onClose, onDelete, serviceId, fetchServices }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
  
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/cms/services/${serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
    
      console.log("Response Data: ", response.data);
  
      if (response.data.success && response.data.message === "Service deleted successfully") {
        toast.success(response.data.message);
        onDelete(serviceId);
        onClose(); 
        fetchServices(); 
        setLoading(false); 
      } else {
        setLoading(false);
        toast.error(response.data.message || "Failed to delete service.");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      setLoading(false);
    }
  };
  
  
  if (!show) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        className="modal-content"
        style={{
          padding: "20px",
          maxWidth: "400px",
          backgroundColor: "white",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this service?</p>
        <div className="modal-actions">
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={loading}
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              marginRight: "10px",
            }}
          >
            {loading ? "Deleting..." : "Yes"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
            style={{
              padding: "10px 20px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteServiceModal;
