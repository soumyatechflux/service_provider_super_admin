import React, { useEffect } from "react";
import Modal from "react-modal";
import "./BookingDetailsModal.css";

const BookingDetailsModal = ({ booking, onClose }) => {
  // Disable background scroll when modal is open
  useEffect(() => {
    if (booking) {
      document.body.style.overflow = "hidden"; // Disable scroll
    } else {
      document.body.style.overflow = ""; // Enable scroll
    }

    // Cleanup to restore body scroll on unmount or when modal is closed
    return () => {
      document.body.style.overflow = "";
    };
  }, [booking]);

  if (!booking) return null;

  const capitalizeFirstLetter = (text) => {
    if (!text) return "N/A"; // Handle null or undefined values
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(+hours);
  date.setMinutes(+minutes);
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};


  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      className="booking-details-modal"
      overlayClassName="modal-overlay"
      ariaHideApp={false}
    >
      <div className="modal-header">
        <h5 className="modal-title">Booking Details</h5>
        <button type="button" className="close" onClick={onClose}>
          <span>&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <p>
          <strong>Customer Name:</strong> {booking.guest_name || "N/A"}
        </p>
        <p>
          <strong>Partner Name:</strong> {booking.partner?.name || "Unknown"}
        </p>
        <p>
          <strong>Sub Category:</strong>{" "}
          {booking.sub_category_name?.sub_category_name || "N/A"}
        </p>
        <p>
          <strong>Price:</strong> {booking.price || "N/A"}
        </p>
        {booking.category_id === 2 && (
  <>
    <p>
      <strong>Address From:</strong>{" "}
      {capitalizeFirstLetter(booking.address_from)}
    </p>
    <p>
      <strong>Address To:</strong>{" "}
      {capitalizeFirstLetter(booking.address_to)}
    </p>
  </>
)}
{(booking.category_id === 1 || booking.category_id === 3) && (
  <p>
    <strong>Visit Address:</strong>{" "}
    {capitalizeFirstLetter(booking.visit_address)}
  </p>
)}

        <p>
          <strong>Status:</strong>{" "}
          {capitalizeFirstLetter(booking.booking_status)}
        </p>
        <p>
          <strong>Payment Mode:</strong>{" "}
          {booking.payment_mode === "online"
            ? "Online"
            : booking.payment_mode === "cod"
            ? "COD"
            : "N/A"}
        </p>

        <p>
          <strong>Payment Status:</strong>{" "}
          {capitalizeFirstLetter(booking.payment_status)}
        </p>
        <p>
          <strong>Booking Date:</strong>{" "}
          {new Date(booking.created_at).toLocaleDateString()}
        </p>
        <p>
          <strong>Visit Date:</strong>{" "}
          {new Date(booking.visit_date).toLocaleDateString()}
        </p>
       <p>
  <strong>Visit Time:</strong> {booking.visit_time ? formatTime(booking.visit_time) : "N/A"}
</p>

      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default BookingDetailsModal;
