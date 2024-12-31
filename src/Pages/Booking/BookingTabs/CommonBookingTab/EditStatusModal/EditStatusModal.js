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
import { toast } from "react-toastify";

const EditStatusModal = ({
  open,
  onClose,
  bookingId,
  getCommissionData,
  dummyData,
  setDummyData,
  setShowEditModal,
}) => {
  const [status, setStatus] = useState("Cancelled");
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
  
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/cancel_booking/${bookingId}`,
        {}, // No payload needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response?.status === 200 && response?.data?.success) {
        toast.success("Booking status updated successfully!");
  
        // Update the local state with updated status
        setDummyData((prevData) => {
          // Create a new array to force re-render
          return prevData.map((item) =>
            item.booking_id === bookingId
              ? { ...item, booking_status: "Cancelled" } // Update status
              : item
          );
        });
  
        getCommissionData(); // Refresh the data if needed
        setShowEditModal(false); // Close the modal
      } else {
        toast.error(response?.data?.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.response?.data?.message || "Error updating status. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog
      open={open}
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
      <DialogTitle>Edit Booking Status</DialogTitle>
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
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleStatusUpdate}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Save"}
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
