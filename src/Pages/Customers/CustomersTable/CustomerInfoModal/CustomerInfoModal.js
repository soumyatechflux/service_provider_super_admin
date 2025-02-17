import React from "react";

const CustomerInfoModal = ({ customer, onClose }) => {
  if (!customer) return null;

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Customer Details</h5>
            {/* <button type="button" className="btn-close" onClick={onClose}></button> */}
          </div>
          <div className="modal-body">
            <p><strong>Name:</strong> {customer.name || "N/A"}</p>
            <p><strong>Email:</strong> {customer.email || "N/A"}</p>
            <p><strong>Phone:</strong> {customer.mobile || "N/A"}</p>
            <p><strong>Gender:</strong> {customer.gender || "Not Provided"}</p>
            <p><strong>Address:</strong> {customer.address || "Not Provided"}</p>
            <p><strong>Rating:</strong> {customer.rating || "N/A"}</p>
            <p><strong>Status:</strong> {customer.active_status}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoModal;