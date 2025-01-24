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

const EditStatusBannerModal = ({
  banner,
  open,
  onClose,
  onStatusChange,
  fetchBanners,
}) => {
  const [status, setStatus] = useState(banner?.activeStatus || "active");
  const [loading, setLoading] = useState(false);

  // Update status when banner changes
  useEffect(() => {
    setStatus(banner?.activeStatus || "active");
  }, [banner]);

  // Reset status when modal is closed
  useEffect(() => {
    if (!open) {
      setStatus(banner?.activeStatus || "active"); // Reset to initial status or default
    }
  }, [open, banner]);

  const handleStatusUpdate = async () => {
    if (!banner) {
      toast.error("No banner selected.");
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
      const payload = {
        banner_id: banner.id,
        active_status: status,
      };

      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/cms/banners/status`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 && response.data.success) {
        toast.success("Banner status updated successfully!");
        onStatusChange(banner.id, status); // Notify parent of change
        fetchBanners(); // Refresh banners
      } else {
        toast.error(response.data.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating banner status:", error);
      toast.error("Error updating status. Please try again.");
    } finally {
      setLoading(false);
      onClose();
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
      <DialogTitle>Edit Banner Status</DialogTitle>
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

export default EditStatusBannerModal;
