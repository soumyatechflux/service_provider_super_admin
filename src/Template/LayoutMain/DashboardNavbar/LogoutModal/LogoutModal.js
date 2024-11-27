import React from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import './LogoutModal.css';

const LogoutModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleYesClick = () => {
    sessionStorage.clear(); 
    navigate("/"); 
    toast.success("Log-Out Successful!");
  };

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="logout-modal-title" aria-describedby="logout-modal-description">
      <div style={modalStyle}>
        <Typography id="logout-modal-title" variant="h6" component="h2">
          Confirm Logout
        </Typography>
        <Typography id="logout-modal-description" sx={{ mt: 2 }}>
          Are you sure you want to logout?
        </Typography>
        <div style={buttonContainerStyle}>
          <Button 
            variant="contained" 
            className="Nobtn-logout-modal" 
            onClick={onClose}
            style={{ marginRight: '10px' }} // Add some space between buttons
          >
            No
          </Button>
          <Button 
            variant="contained" 
            className="Yesbtn-logout-modal" 
            onClick={handleYesClick}
          >
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Styles for the modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px', // Increased width
  backgroundColor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  padding: '20px',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column', // Ensure elements stack vertically
  justifyContent: 'space-between', // Space elements evenly
  height: 'auto', // Optional: Let height adjust based on content
};

// Styles for button container
const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '20px',
  // marginTop: 'auto',
};

export default LogoutModal;
