import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Modal, Form } from "react-bootstrap";

const EditReferralModal = ({ show, onClose, referralData, refreshReferralData }) => {
  const [formData, setFormData] = useState({
    name: "",
    referral_code: "",
    wallet_amount: "",
    wallet_balance: "",
    trx_id: "",
    trx_date: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (referralData) {
      // Set the initial values correctly
      setFormData({
        name: referralData?.name || "",
        referral_code: referralData?.referral_code || "",
        wallet_amount: referralData?.wallet_amount || "", // wallet_amount should be initialized here
        wallet_balance: referralData?.wallet_balance || "",
        trx_id: referralData?.trx_id || "",
        trx_date: referralData?.trx_date || "",
      });
    }
  }, [referralData]); // Ensure this useEffect runs when referralData changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!referralData?.id) {
      toast.error("Referral ID is missing!");
      return;
    }
  
    try {
      setLoading(true);
  
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
  
      const trxId = formData.trx_id;
      const trxDate = formData.trx_date;
  
      const walletBalance = Number(formData.wallet_balance);  // Keep the wallet_balance as it is from the form
      const walletAmount = Number(formData.wallet_amount);    // Keep the wallet_amount as it is from the form
  
      if (isNaN(walletBalance) || isNaN(walletAmount)) {
        toast.error("Invalid wallet balance or wallet amount.");
        setLoading(false);
        return;
      }
  
      const payload = {
        partner_id: referralData.id,
        trx_id: trxId,
        wallet_amount: walletAmount,  // Send the value directly from the form
        wallet_balance: walletBalance,  // Send the value directly from the form
        trx_date: trxDate,
      };
  
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/partner_refer_amount_tranfer`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      setLoading(false);
  
      if (response.status === 200 && response.data.success) {
        toast.success("Referral amount transferred successfully!");
        refreshReferralData();
        onClose();
      } else {
        toast.error(response.data.message || "Failed to transfer referral amount.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Referral Transfer API Error:", error);
      toast.error("An error occurred while processing the transfer. Please try again.");
    }
  };
  

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title>Confirm Referral Amount Transfer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Referral Code</Form.Label>
            <Form.Control
              type="text"
              name="referral_code"
              value={formData.referral_code}
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Wallet Amount</Form.Label>
            <Form.Control
              type="number"
              name="wallet_amount"
              value={formData.wallet_amount}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Wallet Balance</Form.Label>
            <Form.Control
              type="number"
              name="wallet_balance"
              value={formData.wallet_balance}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Transaction ID</Form.Label>
            <Form.Control
              type="text"
              name="trx_id"
              value={formData.trx_id}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Transaction Date</Form.Label>
            <Form.Control
              type="date"
              name="trx_date"
              value={formData.trx_date}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing..." : "Yes, Transfer"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditReferralModal;
