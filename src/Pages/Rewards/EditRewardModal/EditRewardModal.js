import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";

const EditRewardModal = ({ open, onClose, reward }) => {
  const [formData, setFormData] = useState({
    points_per_rupee: "",
    usage_limit: "",
    from_whom: "",
    who_uses: "",
    rewards_sent_by_partner: "",
  });

  useEffect(() => {
    if (reward) {
      setFormData(reward);
    }
  }, [reward]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Reward</h2>
        
        <TextField
          name="points_per_rupee"
          value={formData.points_per_rupee}
          onChange={handleChange}
          label="1 Rs = Points"
          fullWidth
        />
        
        <TextField
          name="usage_limit"
          value={formData.usage_limit}
          onChange={handleChange}
          label="Usage Limit"
          fullWidth
        />

        <button className="btn btn-primary" onClick={onClose}>Save</button>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditRewardModal;
