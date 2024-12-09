
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

const EditCategoriesModal = ({ category, onClose, onStatusChange }) => {
  const [status, setStatus] = useState(category?.active_status || "active");
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      await onStatusChange({ ...category, active_status: status });
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
            <MenuItem value="inactive">In-Active</MenuItem>
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

export default EditCategoriesModal;
