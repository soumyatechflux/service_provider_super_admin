import React, { useState, useEffect } from "react";
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

const EditServiceStatusModal = ({
  service,
  open,
  onClose,
  onStatusChange,
  fetchServices,
}) => {
  const [status, setStatus] = useState(service?.active_status || "active");
  const [loading, setLoading] = useState(false);

  // Update the status when the service prop changes
  useEffect(() => {
    if (service) {
      setStatus(service.active_status);
    }
  }, [service]);

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

      const payload = {
        service_id: Number(service?.id), // Ensure it's a number
        active_status: status,
      };

      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/cms/services/status`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.status === 200 && response?.data?.success) {
        onStatusChange(status); // Notify parent component of status change
        toast.success("Service status updated successfully!");
      } else {
        toast.error(response.data.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("API Error:", error.response?.data); // Debug log
      toast.error("Error updating status. Please try again.");
    } finally {
      setLoading(false);
      fetchServices(); // Refresh services list
      onClose(); // Close the modal after update
    }
  };

  const handleClose = () => {
    setStatus(service?.active_status || "active"); // Reset status to initial value
    onClose(); // Close the modal
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose} // Use handleClose to reset fields
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          maxHeight: "90vh",
          overflow: "auto",
        },
      }}
    >
      <DialogTitle>Edit Service Status</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
            label="Status"
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
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
          onClick={handleClose}
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

export default EditServiceStatusModal;
