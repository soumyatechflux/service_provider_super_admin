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

const EditFAQStatusModal = ({
  faq,  // Changed from "discount" to "faq" to match the CommonFAQsTab prop
  open,
  onClose,
  onStatusChange,
}) => {
  const [status, setStatus] = useState(faq?.active_status || "active");
  const [loading, setLoading] = useState(false);
  console.log("Selected FAQ in Modal:", faq);

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
      console.log("FAQ data:", faq); // Debug log

      const payload = {
        faq_id: Number(faq?.faq_id),  // Ensure it's a number
        active_status: status,
      };

      console.log("Payload:", payload); // Debug log

      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/cms/faqs/status`,  // Adjusted URL endpoint
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response?.status === 200 && response?.data?.success) {
        onStatusChange(status);  // Notify parent component of status change
        toast.success("FAQ status updated successfully!");
      } else {
        toast.error(response.data.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("API Error:", error.response?.data); // Debug log
      toast.error("Error updating status. Please try again.");
    } finally {
      setLoading(false);
      handleClose();  // Close the modal after the update
    }
  };

  const handleClose = () => {
    setStatus(faq?.active_status || "active"); // Reset status to its initial value
    onClose();  // Call the passed onClose function to close the dialog
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          maxHeight: "90vh",
          overflow: "auto",
        },
      }}
    >
      <DialogTitle>Edit FAQ Status</DialogTitle>
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

export default EditFAQStatusModal;
