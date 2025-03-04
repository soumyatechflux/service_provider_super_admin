import React from "react";
import { Modal, Button } from "react-bootstrap";

const PriceDetailModal = ({ show, onHide, bookingData }) => {
  if (!bookingData) {
    return null;
  }

  const renderAmount = (label, amount, style = {}) => (
    <p style={{ ...style }}>
      <strong>{label}:</strong> {amount !== null && amount !== undefined ? amount : "N/A"}
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
          {renderAmount("Extra Charges", bookingData.price2)}
          {renderAmount("Discount Amount", bookingData.discount_amount)}
          {renderAmount("Secure Fee", bookingData.secure_fee)}
          {renderAmount("Grand Total", bookingData.billing_amount, { color: "green", fontWeight: "bold" })}

          <hr style={{color:"black",backgroundColor:"black"}}/>
         
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
