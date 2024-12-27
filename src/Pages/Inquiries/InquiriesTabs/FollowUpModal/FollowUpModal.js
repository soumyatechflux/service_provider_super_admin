import React, { useState } from "react";

const FollowUpModal = ({ show, onClose, inquiry, onSave }) => {
  const [resolutionNote, setResolutionNote] = useState("");
  const [resolvedDate, setResolvedDate] = useState("");

  const handleSave = () => {
    if (!resolutionNote.trim() || !resolvedDate) {
      alert("Please provide all required information.");
      return;
    }
    onSave({ resolutionNote, resolvedDate });
    setResolutionNote("");
    setResolvedDate("");
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Follow-Up Inquiry</h2>
        <p>
          <strong>Customer Name:</strong> {inquiry?.customer_name || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {inquiry?.email || "N/A"}
        </p>
        <p>
          <strong>Phone:</strong> {inquiry?.phone || "N/A"}
        </p>
        <p>
          <strong>Inquiry Type:</strong> {inquiry?.inquiry_type || "N/A"}
        </p>
        <p>
          <strong>Message:</strong> {inquiry?.message || "No message provided."}
        </p>

        {/* Date Picker Field */}
        <div className="form-group">
          <label htmlFor="resolved-date">Resolved Date:</label>
          <input
            type="date"
            id="resolved-date"
            value={resolvedDate}
            onChange={(e) => setResolvedDate(e.target.value)}
            placeholder="Select resolved date"
          />
        </div>

        {/* Resolution Note Field */}
        <div className="form-group">
          <label htmlFor="resolution-note">Resolution Note:</label>
          <textarea
            id="resolution-note"
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
            rows="4"
            placeholder="Describe how the inquiry was resolved"
          />
        </div>

        {/* Modal Actions */}
        <div className="modal-actions">
          <button onClick={handleSave} className="payNow-btn">
            Save
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowUpModal;
