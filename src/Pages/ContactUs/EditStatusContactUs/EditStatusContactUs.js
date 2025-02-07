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
    TextField,
  } from "@mui/material";
  import axios from "axios";
  import React, { useEffect, useState } from "react";
  import { toast } from "react-toastify";
  
  const EditStatusContactUs = ({
    contact,
    open,
    onClose,
    onStatusChange,
    fetchContactData,
  }) => {
    // Initialize status from the contact (default to "New" if not provided)
    const [status, setStatus] = useState(contact?.status || "New");
    const [note, setNote] = useState(contact?.note || "");
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      if (contact) {
        setStatus(contact.status || "New");
        setNote(contact.note || "");
      }
    }, [contact, open]);
  
    const handleStatusUpdate = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
        // Updated payload: properties at the root level.
        const payload = {
          id: contact?.id,
          status: status,
          note: note,
        };
  
        const response = await axios.patch(
          `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/contactus/status`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        if (response?.status === 200 && response?.data?.success) {
          onStatusChange(status);
          toast.success("Contact status updated successfully!");
          fetchContactData();
        } else {
          toast.error(response.data.message || "Failed to update status.");
        }
      } catch (error) {
        console.error("API Error:", error.response?.data);
        toast.error("Error updating status. Please try again.");
      } finally {
        setLoading(false);
        onClose();
      }
    };
  
    const handleCancel = () => {
      setStatus(contact?.status || "New");
      setNote(contact?.note || "");
      onClose();
    };
  
    return (
      <Dialog
        open={open}
        onClose={handleCancel}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: {
            maxHeight: "90vh",
            overflow: "auto",
          },
        }}
      >
        <DialogTitle>Edit Contact Status</DialogTitle>
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
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="In-review">In-review</MenuItem>
              <MenuItem value="Resolve">Resolve</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
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
            onClick={handleCancel}
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
  
  export default EditStatusContactUs;
  