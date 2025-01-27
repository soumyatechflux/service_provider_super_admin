import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import axios from "axios";

const EditStaffModal = ({ show, onClose, onSave, staffData, getStaffData }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [staffId, setStaffId] = useState("");
  const [role, setRole] = useState(""); // State for role
  const [roles, setRoles] = useState([]); // State for roles
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+91"); // Default to India
  const [countryCodes, setCountryCodes] = useState([]); // State for country codes

  useEffect(() => {
    if (staffData) {
      setName(staffData.name || "");
      setEmail(staffData.email || "");
      setMobile(staffData.mobile || "");
      setStaffId(staffData.staff_id || "");
      setRole(staffData.role_id || ""); // Set the role based on the staff data
      setCountryCode(staffData.country_code || "+91"); // Set country code from staff data or default to +91
    }
    fetchRoles(); // Fetch roles when the modal opens
    fetchCountryCodes(); // Fetch country codes when the modal opens
  }, [staffData]);

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

  const fetchCountryCodes = async () => {
    try {
      // Example: Hardcoding country code options
      const codes = [
        { code: "+91", name: "India" },
      ];

      setCountryCodes(codes);
    } catch (error) {
      toast.error("Failed to fetch country codes.");
    }
  };

  const handleSave = async () => {
    if (role === "1") {
      toast.error("Super Admin role can't be assigned.");
      return;
    }
  
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
  
    const formData = {
      staff_id: staffId,
      name: name || undefined,
      email: email || undefined,
      mobile: mobile || undefined,
      role_id: role, // Include role_id in the formData
      country_code: countryCode, // Include country code in the formData
    };
  
    console.log("Payload for PATCH API:", formData);
  
    setLoading(true);
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/staff`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        toast.success("Staff updated successfully!");
        onSave(response.data.data);
        getStaffData();
        onClose();
      } else {
        toast.error(response.data.message || "Failed to update staff.");
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      toast.error("Error updating staff. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Modal
      isOpen={show}
      onRequestClose={onClose}
      contentLabel="Edit Staff Modal"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>Edit Staff</h2>
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
    onChange={(e) => setRole(e.target.value)}
    className="form-control"
    disabled={loading}
  >
    <option value="">Select Role</option>
    {roles.length > 0 ? (
      roles.map((roleItem) => (
        <option key={roleItem.role_id} value={roleItem.role_id}>
          {roleItem.role_name}
        </option>
      ))
    ) : (
      <option value="">No roles available</option>
    )}
  </select>
</div>


        <div className="form-group">
          <label>Country Code</label>
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="form-control"
            disabled
          >
            {countryCodes.length > 0 ? (
              countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} {country.code}
                </option>
              ))
            ) : (
              <option value="">No country codes available</option>
            )}
          </select>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
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

export default EditStaffModal;
