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
  TextField,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const EditStatusModal = ({ support, onClose, onStatusChange, getSupportData }) => {
  const [status, setStatus] = useState(support?.status || "New"); // Ensure proper casing
  const [note, setNote] = useState(support?.note || ""); // Load existing note if available
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async () => {
    if (!support || !support.id) {
      console.error("Support data is missing:", support);
      toast.error("Support ID is missing. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

      const payload = {
        id: support.id,
        status: status, // Corrected status keys
        note: note, // Include note in payload
      };

      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/help_center/status`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200 && response?.data?.success) {
        onStatusChange(support.id, status, note);
        toast.success(response?.data?.message || "Status updated successfully!");
        getSupportData();
      } else {
        toast.error(response?.data?.message || "Failed to update status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      const errorMessage = error.response?.data?.message || "Failed to update status. Please try again.";
      toast.error(errorMessage);
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
        {/* Status Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
            label="Status"
          >
            {status === "New" && (
              <MenuItem value="New" disabled>
                New
              </MenuItem>
            )}
            <MenuItem value="In-review">In Review</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>

        {/* Note TextArea */}
        <TextField
          label="Note"
          multiline
          rows={3}
          fullWidth
          margin="normal"
          variant="outlined"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)"
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleStatusUpdate}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
        <Button variant="contained" onClick={onClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStatusModal;












