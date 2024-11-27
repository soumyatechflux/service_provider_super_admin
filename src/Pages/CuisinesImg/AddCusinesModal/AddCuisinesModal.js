import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function AddCuisinesModal({ show, handleClose, handleSave }) {
  const [bannerText, setBannerText] = useState("");
  const [bannerImage, setBannerImage] = useState(null);

  const handleImageChange = (e) => {
    setBannerImage(URL.createObjectURL(e.target.files[0])); // Preview image before save
  };

  const handleSubmit = () => {
    if (bannerText && bannerImage) {
      handleSave(bannerText, bannerImage);
      handleClose(); 
    } else {
      alert("Please provide both text and image.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>Add New Banner</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBannerImage" className="mb-3">
            <Form.Label>Cuisine Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
          </Form.Group>

          <Form.Group controlId="formBannerText">
            <Form.Label>Cuisine Name</Form.Label>
            <Form.Control
              type="text"
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              placeholder="Enter banner text"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddCuisinesModal;
