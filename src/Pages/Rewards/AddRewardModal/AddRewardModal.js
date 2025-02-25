import React, { useState } from "react";
import { TextField } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddRewardModal = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    points_per_rupee: "",
    usage_limit: "",
    from_whom: "",
    who_uses: "",
    reward_amount_by_partner: "",
  });

  if (!open) return null;

  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateFields = () => {
    const { points_per_rupee, usage_limit, from_whom, who_uses, reward_amount_by_partner } = formData;
    if (!points_per_rupee || isNaN(points_per_rupee) || points_per_rupee <= 0) {
      toast.error("Points per Rupee must be a positive number.");
      return false;
    }
    if (!usage_limit || isNaN(usage_limit) || usage_limit <= 0) {
      toast.error("Usage Limit must be a positive number.");
      return false;
    }
    if (!from_whom.trim()) {
      toast.error("From Whom is required.");
      return false;
    }
    if (!who_uses.trim()) {
      toast.error("Who Uses Rewards is required.");
      return false;
    }
    if (!reward_amount_by_partner.trim()) {
      toast.error("Reward amount by partner is required.");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateFields()) return;
  
    const newReward = {
      points_per_rupee: formData.points_per_rupee,
      usage_limit: formData.usage_limit,
      from_whom: formData.from_whom,
      who_uses: formData.who_uses,
      rewards_sent_by_partner: formData.reward_amount_by_partner, 
    };
  
    if (typeof onSave === "function") onSave(newReward);
    handleCancel();
  };
  
  return (
    <>
      <ToastContainer />
      <div className="modal-overlay">
        <div className="modal-content" style={{ height: "80%", overflowY: "auto" }}>
          <h2>Add Reward</h2>

          <div className="form-group">
            <label htmlFor="points_per_rupee">1 Rs = Points:</label>
            <TextField
              id="points_per_rupee"
              name="points_per_rupee"
              type="number"
              value={formData.points_per_rupee}
              onChange={handleChange}
              placeholder="Enter points per rupee"
              fullWidth
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="usage_limit">Usage Limit:</label>
            <TextField
              id="usage_limit"
              name="usage_limit"
              type="number"
              value={formData.usage_limit}
              onChange={handleChange}
              placeholder="Enter usage limit"
              fullWidth
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="from_whom">From Whom Given:</label>
            <TextField
              id="from_whom"
              name="from_whom"
              value={formData.from_whom}
              onChange={handleChange}
              placeholder="Enter source of reward"
              fullWidth
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="who_uses">Who Uses Rewards:</label>
            <TextField
              id="who_uses"
              name="who_uses"
              value={formData.who_uses}
              onChange={handleChange}
              placeholder="Enter eligible users"
              fullWidth
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reward_amount_by_partner">How much reward sent by partner:</label>
            <TextField
              id="reward_amount_by_partner"
              name="reward_amount_by_partner"
              value={formData.reward_amount_by_partner}
              onChange={handleChange}
              placeholder="Enter reward amount"
              fullWidth
              required
            />
          </div>

          <div className="modal-actions">
            <button onClick={handleSave} className="btn btn-primary" style={{ width: "100%" }}>
              Save
            </button>
            <button onClick={handleCancel} className="btn btn-secondary" style={{ width: "100%" }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRewardModal;
