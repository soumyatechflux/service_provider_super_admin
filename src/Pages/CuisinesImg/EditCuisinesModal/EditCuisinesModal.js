import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function EditCuisinesModal({ show, handleClose, bannerToEdit, handleUpdate }) {
  const [image, setImage] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    if (bannerToEdit) {
      setImage(bannerToEdit.image); // Set initial image
      setText(bannerToEdit.text); // Set initial text
    }
  }, [bannerToEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Set image preview after file upload
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    handleUpdate({ ...bannerToEdit, image, text });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>Edit Banner</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formImage">
            <Form.Label>Cuisine Image</Form.Label>
            {image && <img src={image} alt="Banner Preview" style={{ width: "90%", marginBottom: "10px" }} />}
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Form.Group>

          <Form.Group controlId="formText" style={{ marginTop: "15px" }}>
            <Form.Label>Cuisine Name</Form.Label>
            <Form.Control
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditCuisinesModal;
