import React, { useState } from "react";
import { TextField } from "@mui/material";
import "./TransactionModal.css";
import axios from "axios";
import { toast } from "react-toastify";

const TransactionModal = ({ item, onClose, setLoading }) => {
  const [transactionId, setTransactionId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  const handlePayNow = async () => {
    if (!transactionId || !paymentDate) {
      alert("Please enter both a transaction ID and a payment date.");
      return;
    }
    await postCommissionData(transactionId, paymentDate);
    onClose(); // Close the modal after the operation
  };

  const postCommissionData = async (transactionId, paymentDate) => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );

      setLoading(true);

      // Explicitly construct the payload with all required fields
      const payload = {
        partner_id: item.partner_id, // Partner ID from the item prop
        payout_date: paymentDate, // Selected payment date
        payment_transaction_id: transactionId, // Transaction ID entered by the user
      };

      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/payout_paid`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      if (response?.status === 200 && response?.data?.success) {
        toast.success("Payment successful!");
      } else {
        toast.error(response.data.message || "Failed to post commission.");
      }
    } catch (error) {
      console.error("Error posting commission:", error);
      toast.error("Failed to post commission. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Payment Details</h2>
        <p>
          <strong>Partner Name:</strong> {item.name}
        </p>
        <p>
          <strong>Amount Due:</strong> ₹ {item.total_partner_amount}
        </p>

        {/* Date Picker Field */}
        <div className="form-group">
          <label htmlFor="payment-date">Date:</label>
          <TextField
            type="date"
            id="payment-date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            fullWidth
          />
        </div>

        {/* Transaction ID Field */}
        <div className="form-group">
          <label htmlFor="transaction-id">Transaction ID:</label>
          <input
            type="text"
            id="transaction-id"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Enter Transaction ID"
          />
        </div>

        {/* Modal Actions */}
        <div className="modal-actions">
          <button onClick={handlePayNow} className="payNow-btn">
            Pay Now
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
