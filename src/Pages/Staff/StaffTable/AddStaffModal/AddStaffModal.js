import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import axios from "axios";

const AddStaffModal = ({ show, onClose, onSave, getStaffData }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset form fields whenever the modal opens
  useEffect(() => {
    if (show) {
      setName("");
      setEmail("");
      setMobile("");
    }
  }, [show]);

  const handleSubmit = async () => {
    if (!name || !email || !mobile) {
      toast.error("Name, email, and mobile number are required!");
      return;
    }

    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

    if (!token) {
      toast.error("Authentication token is missing!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", mobile);
    formData.append("role_id", "AUTO_GENERATED_ROLE_ID"); // Replace with logic or value if needed

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/staff/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Staff added successfully!");
        onSave(response.data); // Update the parent component with the new staff
        getStaffData();
        onClose();
      } else {
        toast.error(response.data.message || "Failed to add staff.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={show}
      onRequestClose={onClose}
      contentLabel="Add Staff Modal"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>Add Staff</h2>
      <form>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
            placeholder="Enter name"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Enter email"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Mobile No</label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="form-control"
            placeholder="Enter mobile number"
            disabled={loading}
          />
        </div>
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddStaffModal;