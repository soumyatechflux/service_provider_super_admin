import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast

const EditStatusModal = ({ support, onClose, onStatusChange }) => {
  const [status, setStatus] = useState(support?.status || "open");
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
  
      // Create the payload as you want it to appear in the response format
      const payload = {
        support: {
          support_id: support.support_id,
          status: status,
        },
      };
  
      // Make the PATCH request with the payload
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/supports/action`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Check if the response is successful and contains the message
      if (response?.status === 200 && response?.data?.success) {
        onStatusChange(response.data.message); // Send message instead of status for parent update
        
        // Show success toast message with the response message
        toast.success(response?.data?.message || "Status updated successfully!");
      } else {
        toast.error("Failed to update status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };
  
  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          maxHeight: "90vh",
          overflow: "auto",
        },
      }}
    >
      <DialogTitle>Edit Status</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label" shrink>
            Status
          </InputLabel>
          <Select
            labelId="status-label"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
            label="Status"
          >
            <MenuItem value="in-progress">In Progress</MenuItem> 
            <MenuItem value="resolved">Resolved</MenuItem>       
            <MenuItem value="closed">Closed</MenuItem> 
          </Select>
        </FormControl>
        {/* {loading && <CircularProgress size={40} style={{ margin: "20px auto", display: "block" }} />} Display loader in content */}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleStatusUpdate}
          disabled={loading}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
          style={{
            backgroundColor: "rgb(223, 22, 22)",
            color: "white",
            border: "none",
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStatusModal;
