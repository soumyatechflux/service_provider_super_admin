import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import axios from "axios";

const AddStaffModal = ({ show, onClose, onSave, getStaffData }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState(""); // New state for role
  const [roles, setRoles] = useState([]); // Initialize roles as an empty array
  const [loading, setLoading] = useState(false);
  const [roleError, setRoleError] = useState(""); // State for role error message
  const [countryCode] = useState("+91"); // Fixed country code (India)
  
  // Removed the countryCodes state since we don't need to fetch country codes anymore
  // const [countryCodes, setCountryCodes] = useState([]); // No longer needed

  // Fetch roles on modal open
  useEffect(() => {
    if (show) {
      setName("");
      setEmail("");
      setMobile("");
      setRole(""); // Reset role when modal opens
      setRoleError(""); // Reset role error when modal opens
      fetchRoles(); // Fetch roles when modal is shown
    }
  }, [show]);

  const fetchRoles = async () => {
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
      if (!token) {
        toast.error("Authentication token is missing!");
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/roles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setRoles(response.data.data || []); // Set roles to the 'data' array from the API response
      } else {
        toast.error(response.data.message || "Failed to fetch roles.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred while fetching roles."
      );
    }
  };

  const handleSubmit = async () => {
    if (!name || !email || !mobile || !role) {
      toast.error("Name, email, mobile number, and role are required!");
      return;
    }

    // Prevent saving if Super Admin role is selected
    if (role === "1") {
      setRoleError("Super Admin role cannot be assigned.");
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
    formData.append("role_id", role); // Use the selected role
    formData.append("country_code", countryCode); // Fixed country code (+91)

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
        <div className="form-group">
          <label>Assign Role</label>
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setRoleError(""); // Reset error when the role changes
            }}
            className="form-control"
            disabled={loading}
          >
            <option value="">Select Role</option>
            {roles.length > 0 ? (
              roles.map((roleItem) => (
                <option
                  key={roleItem.role_id}
                  value={roleItem.role_id}
                  disabled={roleItem.role_id === "1"} // Disable Super Admin role
                >
                  {roleItem.role_name}
                </option>
              ))
            ) : (
              <option value="">No roles available</option>
            )}
          </select>
          {roleError && <div className="error-message">{roleError}</div>}
        </div>
        <div className="form-group">
          <label>Country Code</label>
          <input
            type="text"
            value={countryCode} // Display the fixed country code (+91)
            className="form-control"
            disabled
          />
        </div>
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
            style={{ width: "100%" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddStaffModal;
