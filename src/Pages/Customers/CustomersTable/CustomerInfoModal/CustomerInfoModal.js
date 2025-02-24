import React from "react";

const CustomerInfoModal = ({ customer, onClose }) => {
  if (!customer) return null;

  return (
    <div className="modal fade show d-flex align-items-center justify-content-center" style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "600px" }}>
        <div className="modal-content" style={{ maxHeight: "80vh", overflowY: "auto" }}>
          <div className="modal-header">
            <h5 className="modal-title">Customer Details</h5>
          </div>
          <div className="modal-body">
            <p><strong>ID:</strong> {customer.id ?? "N/A"}</p>
            <p><strong>Name:</strong> {customer.name ?? "N/A"}</p>
            <p><strong>Email:</strong> {customer.email ?? "N/A"}</p>
            <p><strong>Phone:</strong> {customer.country_code ? `${customer.country_code} ${customer.mobile ?? "N/A"}` : customer.mobile ?? "N/A"}</p>
            <p><strong>Gender:</strong> {customer.gender ?? "N/A"}</p>
            <p><strong>Address:</strong> {customer.address ?? "N/A"}</p>
            <p><strong>Registered By:</strong> {customer.registered_by ?? "N/A"}</p>
            <p><strong>Rating:</strong> {customer.rating ?? "N/A"}</p>
            <p><strong>Status:</strong> {customer.active_status ?? "N/A"}</p>

            {/* Bookings Section */}
            <h5 className="mt-3"><strong>Bookings</strong></h5>
            <p><strong>Total:</strong> {customer.bookings?.total ?? "N/A"}</p>
            <p><strong>Upcoming:</strong> {customer.bookings?.upcoming ?? "No Upcoming Bookings"}</p>
            <p><strong>Cancelled:</strong> {customer.bookings?.cancelled ?? "No Cancelled Bookings"}</p>
            <p><strong>Completed:</strong> {customer.bookings?.completed ?? "No Completed Bookings"}</p>
            <p><strong>In Progress:</strong> {customer.bookings?.inprogress ?? "No In Progress Bookings"}</p>
            <p><strong>Not Started:</strong> {customer.bookings?.not_started ?? "No Not Started Bookings"}</p>
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
