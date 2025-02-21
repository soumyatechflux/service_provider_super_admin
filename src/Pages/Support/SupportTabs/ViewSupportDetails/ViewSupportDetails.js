import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";

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
        const token = sessionStorage.getItem(
          "TokenForSuperAdminOfServiceProvider"
        );
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
          setBookingDetails(null);
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setBookingDetails(null);
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
        ) : bookingDetails && Object.keys(bookingDetails).length > 0 ? (
          <>
            {bookingDetails.booking_id && (
              <p>
                <strong>Booking ID:</strong> {bookingDetails.booking_id}
              </p>
            )}
            {bookingDetails.guest_name && (
              <p>
                <strong>Guest Name:</strong> {bookingDetails.guest_name}
              </p>
            )}
            {bookingDetails.visit_date && (
              <p>
                <strong>Visit Date:</strong>{" "}
                {new Date(bookingDetails.visit_date).toLocaleDateString()}
              </p>
            )}
            {bookingDetails.visit_time && (
              <p>
                <strong>Visit Time:</strong> {bookingDetails.visit_time}
              </p>
            )}
            {bookingDetails.visit_address &&
            bookingDetails.visit_address.replace(/[, ]+/g, "").trim() !== "" ? (
              <p>
                <strong>Visit Address:</strong> {bookingDetails.visit_address}
              </p>
            ) : (
              <p>
                <strong>Visit Address:</strong> N/A
              </p>
            )}

            {bookingDetails.address_from && (
              <p>
                <strong>Address From:</strong> {bookingDetails.address_from}
              </p>
            )}
            {bookingDetails.address_to && (
              <p>
                <strong>Address To:</strong> {bookingDetails.address_to}
              </p>
            )}
            {bookingDetails.sub_category?.sub_category_name && (
              <p>
                <strong>Sub Category:</strong>{" "}
                {bookingDetails.sub_category.sub_category_name}
              </p>
            )}
            {bookingDetails.billing_amount && (
              <p>
                <strong>Billing Amount:</strong> {bookingDetails.billing_amount}
              </p>
            )}
            {bookingDetails.payment_mode && (
              <p>
                <strong>Payment Mode:</strong>{" "}
                {bookingDetails.payment_mode === "online"
                  ? "Online"
                  : bookingDetails.payment_mode === "cod"
                  ? "COD"
                  : bookingDetails.payment_mode}
              </p>
            )}
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
