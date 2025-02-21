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
  TextField,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const EditStatusPartnerModal = ({ support, onClose, onStatusChange, getSupportData }) => {
  const [status, setStatus] = useState(support?.status || "New"); // Default to "New"
  const [priority, setPriority] = useState(support?.priority || "Medium"); // Default to "Medium"
  const [assign, setAssign] = useState(support?.assign || ""); // Default to empty
  const [note, setNote] = useState(""); // Initially empty
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (support) {
      setStatus(support?.status || "New");
      setPriority(support?.priority || "Medium");
      setAssign(support?.assign || "");
      setNote(support?.note || "");
    }
  }, [support]);

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
        status,
        priority, // Include priority in payload
        assign, // Include assign in payload
        note, // Include previous/existing note
      };

      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/help_center_partner/status`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200 && response?.data?.success) {
        onStatusChange(support.id, status, priority, assign, note);
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
          >
            <MenuItem value="New">New</MenuItem>
            <MenuItem value="In-review">In Review</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>

        {/* Priority Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="priority-label">Priority</InputLabel>
          <Select
            labelId="priority-label"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            fullWidth
          >
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>

        {/* Assign To Input */}
        <TextField
          label="Assign To"
          fullWidth
          margin="normal"
          variant="outlined"
          value={assign}
          onChange={(e) => setAssign(e.target.value)}
          placeholder="Enter assignee name"
        />

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

export default EditStatusPartnerModal;
