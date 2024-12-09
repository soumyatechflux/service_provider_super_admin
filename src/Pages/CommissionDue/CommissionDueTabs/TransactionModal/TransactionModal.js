import React, { useState } from "react";
import { TextField } from "@mui/material"; // Import TextField from Material-UI
import './TransactionModal.css'
import axios from "axios";
import { toast } from "react-toastify";

const TransactionModal = ({ item, onClose, setLoading }) => {
  const [transactionId, setTransactionId] = useState("");
  const [paymentDate, setPaymentDate] = useState(""); // State to store the selected date

  const handlePayNow = async () => {
    if (!transactionId || !paymentDate) {
      alert("Please enter both a transaction ID and a payment date.");
      return;
    }
    await postCommissionData(transactionId, paymentDate);
    alert(`Payment processed for ${item.name} with Transaction ID: ${transactionId} on ${paymentDate}`);
    // onClose(); // Close the modal
  };

  
  
  const postCommissionData = async (transactionId, paymentDate) => {
    onClose();
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );
      
      setLoading(true);

      

      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/postCommissionDatadffffffffffffffffffffffd`,
        {
          transactionId,
          paymentDate
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      if (response?.status === 200 && response?.data?.success) {
        const data = response?.data?.data || [];
        // setDummy_Data(data);
      } else {
        toast.error(
          response.data.message || "Failed to post commission."
        );
        setLoading(false);
      }
      onClose();
    } catch (error) {
      console.error("Error posting commission:", error);
      toast.error("Failed to post commission. Please try again.");
      setLoading(false);
      onClose();
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
        <label htmlFor="transaction-id">Date:</label>
          <TextField
            
            type="date"
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
