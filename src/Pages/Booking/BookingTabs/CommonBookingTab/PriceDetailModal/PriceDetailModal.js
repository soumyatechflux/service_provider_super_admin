import React from "react";
import { Modal, Button } from "react-bootstrap";

const PriceDetailModal = ({ show, onHide, bookingData }) => {
  if (!bookingData) {
    return null;
  }

  const renderAmount = (label, amount) => {
    if (parseFloat(amount) > 0) {
      return (
        <p><strong>{label}:</strong> {amount}</p>
      );
    }
    return null;
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>Price Breakdown</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {renderAmount("Total Amount", bookingData.total_amount)}
          {renderAmount("Discount Amount", bookingData.discount_amount)}
          {/* {renderAmount("Platform Fee", bookingData.platform_fee)} */}
          {renderAmount("All Taxes", bookingData.all_taxes)}
          {renderAmount("Secure Fee", bookingData.secure_fee)}
          {renderAmount("Grand Total", bookingData.billing_amount)}
          {renderAmount("Commission Amount", bookingData.commission_amount)}
          {renderAmount("Partner Amount", bookingData.partner_amount)}
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
