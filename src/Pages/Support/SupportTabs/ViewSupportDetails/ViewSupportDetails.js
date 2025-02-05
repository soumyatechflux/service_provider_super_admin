import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
// import "./BookingDetailsModal.css";

const ViewSupportDetails = ({ bookingId, onClose }) => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookingId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [bookingId]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
        const response = await axios.get(
          `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/bookings/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200 && response.data.success) {
          setBookingDetails(response.data.data);
        } else {
          console.error("Failed to fetch booking details");
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  if (!bookingId) return null;

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
        {loading ? (
          <p>Loading...</p>
        ) : bookingDetails ? (
          <>
            <p>
              <strong>Booking ID:</strong> {bookingDetails.booking_id || "N/A"}
            </p>
            <p>
              <strong>Guest Name:</strong> {bookingDetails.guest_name || "N/A"}
            </p>
            <p>
              <strong>Visit Date:</strong>{" "}
              {new Date(bookingDetails.visit_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Visit Time:</strong> {bookingDetails.visit_time || "N/A"}
            </p>
            <p>
              <strong>Visit Address:</strong> {bookingDetails.visit_address || "N/A"}
            </p>
            <p>
              <strong>Sub Category:</strong>{" "}
              {bookingDetails.sub_category?.sub_category_name || "N/A"}
            </p>
            <p>
              <strong>Billing Amount:</strong> {bookingDetails.billing_amount || "N/A"}
            </p>
            <p>
              <strong>Payment Mode:</strong>{" "}
              {bookingDetails.payment_mode === "online"
                ? "Online"
                : bookingDetails.payment_mode === "cod"
                ? "COD"
                : bookingDetails.payment_mode || "N/A"}
            </p>
            <p>
              <strong>Payment Status:</strong>{" "}
              {bookingDetails.payment_status || "N/A"}
            </p>
          </>
        ) : (
          <p>No details available</p>
        )}
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ViewSupportDetails;