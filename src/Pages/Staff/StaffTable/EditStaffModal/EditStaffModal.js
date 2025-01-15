import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import axios from "axios";

const EditStaffModal = ({ show, onClose, onSave,staffData,getStaffData }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [staffId, setStaffId] = useState(""); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (staffData) {
      setName(staffData.name || "");
      setEmail(staffData.email || "");
      setMobile(staffData.mobile || "");
      setStaffId(staffData.staff_id || ""); 
    }
  }, [staffData]);

  const handleSave = async () => {
    const token = sessionStorage.getItem(
      "TokenForSuperAdminOfServiceProvider"
    );

    const formData = {
      staff_id: staffId, 
      name: name || undefined,
      email: email || undefined,
      mobile: mobile || undefined,
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
        <div className="modal-actions">
        <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading}
            style={{width:"100%"}}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
            style={{width:"100%"}}
          >
            Cancel
          </button>
         
        </div>
      </form>
    </Modal>
  );
};

export default EditStaffModal;
