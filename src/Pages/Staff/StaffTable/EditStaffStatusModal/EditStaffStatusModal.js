import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditStaffStatusModal = ({
  open,
  onClose,
  onStatusChange,
  staff,
  initialStatus,
}) => {
  const [status, setStatus] = useState(initialStatus || "active");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setStatus(initialStatus || "active"); // Reset status when modal opens
    }
  }, [open, initialStatus]);

  const handleStatusUpdate = async () => {
    if (!staff?.id) {
      toast.error("Staff ID is missing. Unable to update status.");
      onClose();
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

      const payload = {
        staff_id: Number(staff?.id), // Use staff.id here
        active_status: status,
      };

      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/staff/status`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.status === 200 && response?.data?.success) {
        onStatusChange(status); // Notify parent of status change
        toast.success("Staff status updated successfully!");
      } else {
        toast.error(response?.data?.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("API Error:", error.response?.data); // Debug log
      toast.error("Error updating status. Please try again.");
    } finally {
      setLoading(false);
      onClose(); // Close the modal after API call
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
      <DialogTitle>Edit Staff Status</DialogTitle>
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
            <MenuItem value="inactive">InActive</MenuItem>
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

export default EditStaffStatusModal;
