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
import React, { useState } from "react";
import { toast } from "react-toastify";

const EditCategoriesModal = ({ category, onClose, onStatusUpdateSuccess }) => {
  const [status, setStatus] = useState(category?.active_status || "active");
  const [loading, setLoading] = useState(false);

  const updateCategoryStatus = async () => {
    try {
      setLoading(true);

      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/category/status`,
        {
          category: {
            category_id: category.id,
            active_status: status,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        toast.success("Category status updated successfully.");
        
      
        onStatusUpdateSuccess(); 

      } else {
        toast.error(response.data.message || "Failed to update category status. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the category status.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleSave = () => {
    updateCategoryStatus();
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
      <DialogTitle>Edit Category Status</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label" shrink>
            Active Status
          </InputLabel>
          <Select
            labelId="status-label"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
            label="Active Status"
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
          onClick={handleSave}
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

export default EditCategoriesModal;

