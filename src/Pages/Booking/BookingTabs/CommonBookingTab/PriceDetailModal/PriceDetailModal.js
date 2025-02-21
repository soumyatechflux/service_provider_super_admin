import React from "react";
import { Modal, Button } from "react-bootstrap";

const PriceDetailModal = ({ show, onHide, bookingData }) => {
  if (!bookingData) {
    return null;
  }

  const renderAmount = (label, amount) => (
    <p>
      <strong>{label}:</strong> {amount && parseFloat(amount) > 0 ? amount : "N/A"}
    </p>
  );

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>Price Breakdown</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {renderAmount("Amount", bookingData.total_amount)}
          {renderAmount("Taxes and Fees", bookingData.all_taxes)}
          {renderAmount("Extra Charges", bookingData.extra_charge)}
          {renderAmount("Discount Amount", bookingData.discount_amount)}
          {renderAmount("Secure Fee", bookingData.secure_fee)}
          {renderAmount("Commission Amount", bookingData.commission_amount)}
          {renderAmount("Partner Amount", bookingData.partner_amount)}
          <hr style={{color:"black",backgroundColor:"black"}}/>
          {renderAmount("Grand Total", bookingData.billing_amount)}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PriceDetailModal;
