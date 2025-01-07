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

const EditDiscountStatusModal = ({
  discount, 
  open,
  onClose,
  onStatusChange,
  fetchDiscountData
}) => {
  const [status, setStatus] = useState(discount?.active_status || "active");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (discount) {
      setStatus(discount.active_status || "active");
    }
  }, [discount, open]);

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
      const payload = {
        discount: {
          voucher_id: Number(discount?.voucher_id),
          active_status: status,
        },
      };

      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/discount/status`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.status === 200 && response?.data?.success) {
        onStatusChange(status);
        toast.success("Discount status updated successfully!");
        fetchDiscountData();
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
    setStatus(discount?.active_status || "active");
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
      <DialogTitle>Edit Discount Status</DialogTitle>
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

export default EditDiscountStatusModal;
