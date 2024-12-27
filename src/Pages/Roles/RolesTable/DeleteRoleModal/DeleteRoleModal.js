import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DeleteRoleModal = ({ show, onClose, onConfirm, roleId }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
  
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/roles/${roleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setLoading(false);
  
      if (response?.status === 200 && response?.data?.success) {
        toast.success("Role deleted successfully!");
        onConfirm(roleId); // Notify parent to update state
      } else {
        toast.error(response.data.message || "Failed to delete role.");
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred while deleting the role. Please try again.");
    }
  };
  

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this role?</p>
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

export default DeleteRoleModal;
