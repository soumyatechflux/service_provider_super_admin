import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const EditHelpCentreModal = ({ open, onClose, onStatusChange, queryData }) => {
  const [status, setStatus] = useState(queryData?.status || "Pending");
  const [loading, setLoading] = useState(false);

  // Sync the status when the queryData prop changes
  useEffect(() => {
    if (queryData?.status) {
      setStatus(queryData.status);
    }
  }, [queryData]);

  const handleStatusUpdate = async () => {
    if (!queryData?.query_id) {
      toast.error("Query ID is missing. Unable to update status.");
      onClose();
      return;
    }

    setLoading(true);
    try {
      // Replace with actual API URL for updating the status
      const response = await axios.patch(
        `https://your-api-url.com/api/helpcentre/query/status`,
        { query_id: queryData.query_id, status },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("TokenForSuperAdminOfServiceProvider")}`,
          },
        }
      );

      if (response?.status === 200) {
        onStatusChange(queryData.query_id, status); // Update status in parent
        toast.success("Query status updated successfully!");
      } else {
        toast.error(response?.data?.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Error updating status. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>Edit Help Centre Query Status</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          {/* <InputLabel id="status-label">Status</InputLabel> */}
          <Select
            labelId="status-label"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleStatusUpdate} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Save"}
        </Button>
        <Button variant="outlined" onClick={handleCancel} style={{ backgroundColor: "rgb(223, 22, 22)", color: "white" }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditHelpCentreModal;
