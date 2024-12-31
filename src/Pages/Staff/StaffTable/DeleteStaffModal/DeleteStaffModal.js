import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DeleteStaffModal = ({ show, onClose, onConfirm, staffId,getStaffData }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
  
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/staff/${staffId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setLoading(false);
  
      if (response.data.message == "Staff deleted successfully") {
        toast.success("Staff deleted successfully!");
        onConfirm(staffId); // Notify parent to update state
        getStaffData()
      } else {
        toast.error(response.data.message || "Failed to delete staff.");
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred while deleting the staff. Please try again.");
    }
  };
  

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this staff?</p>
        <div className="modal-actions">
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStaffModal;
