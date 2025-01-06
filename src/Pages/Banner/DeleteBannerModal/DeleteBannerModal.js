import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DeleteBannerModal = ({ show, onClose, bannerId, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/cms/banners/${bannerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        toast.success("Banner deleted successfully!");
        onDeleteSuccess(bannerId); // Update the parent component state
        onClose(); // Close the modal
      } else {
        toast.error("Failed to delete banner.");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Error deleting banner. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this banner?</p>
        <div className="modal-actions">
          <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
            Yes
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBannerModal;
