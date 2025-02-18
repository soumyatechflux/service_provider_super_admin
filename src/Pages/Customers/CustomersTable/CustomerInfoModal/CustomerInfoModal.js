import React from "react";

const CustomerInfoModal = ({ customer, onClose }) => {
  if (!customer) return null;

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
      <div className="modal-dialog" style={{ maxWidth: "600px" }}>
        <div className="modal-content" style={{ maxHeight: "80vh", overflowY: "auto" }}>
          <div className="modal-header">
            <h5 className="modal-title">Customer Details</h5>
            {/* <button type="button" className="btn-close" onClick={onClose}></button> */}
          </div>
          <div className="modal-body">
            {customer.id && <p><strong>ID:</strong> {customer.id}</p>}
            {customer.name && <p><strong>Name:</strong> {customer.name}</p>}
            {customer.email && <p><strong>Email:</strong> {customer.email}</p>}
            {customer.mobile && <p><strong>Phone:</strong> {customer.country_code} {customer.mobile}</p>}
            {customer.gender && <p><strong>Gender:</strong> {customer.gender}</p>}
            {customer.address && <p><strong>Address:</strong> {customer.address}</p>}
            {customer.registered_by && <p><strong>Registered By:</strong> {customer.registered_by}</p>}
            {customer.rating !== undefined && <p><strong>Rating:</strong> {customer.rating}</p>}
            {customer.active_status && <p><strong>Status:</strong> {customer.active_status}</p>}
            
            {/* Bookings Section - Only show if any booking data exists */}
            {customer.bookings && Object.values(customer.bookings).some(value => value !== null) && (
              <>
                <h5 className="mt-3"><strong>Bookings</strong></h5>
                {customer.bookings.total !== undefined && <p><strong>Total:</strong> {customer.bookings.total}</p>}
                {customer.bookings.upcoming !== null && <p><strong>Upcoming:</strong> {customer.bookings.upcoming}</p>}
                {customer.bookings.cancelled !== null && <p><strong>Cancelled:</strong> {customer.bookings.cancelled}</p>}
                {customer.bookings.completed !== null && <p><strong>Completed:</strong> {customer.bookings.completed}</p>}
                {customer.bookings.inprogress !== null && <p><strong>In Progress:</strong> {customer.bookings.inprogress}</p>}
              </>
            )}
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
