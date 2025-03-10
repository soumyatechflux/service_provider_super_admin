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
  TextField, // Import TextField for Note
} from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../../../Loader/Loader";

const EditRestroModal = ({
show,
handleClose,
restaurantDetails,
getRestaurantTableData,
}) => {
const [loading, setLoading] = useState(false);
const [restaurant, setRestaurant] = useState({
  status: restaurantDetails?.active_status || "", 
  note: restaurantDetails?.note || "", // Load previous note
});

const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

const statusOptions = [
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
  { key: "suspended", label: "Suspended" },
  { key: "blocked", label: "Blocked" },
];

// Reset form fields whenever modal is opened
useEffect(() => {
  if (show) {
    setRestaurant({
      status: restaurantDetails?.active_status || "",
      note: restaurantDetails?.note || "",
    });
  }
}, [show, restaurantDetails]);

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setRestaurant((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleFormSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const body = {
    partner: {
      partner_id: restaurantDetails?.id,
      active_status: restaurant.status,
      note: restaurant.note, // Send note in API request
    },
  };

  try {
    const response = await axios.patch(
      `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/partners/status`,
      body,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response?.data?.success === true) {
      toast.success(response.data.message || "Partner updated successfully!");
      getRestaurantTableData();
      handleClose();
    } else {
      toast.error(response.data.message || "Failed. Please try again.");
    }
  } catch (error) {
    toast.error("Failed to update partner. Please try again.");
    console.error("Error:", error);
  } finally {
    setLoading(false);
  }
};

return (
  <>
    {loading && <Loader />}
    <Dialog
      open={show}
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
      <DialogTitle>Change Partner Status</DialogTitle>
      <DialogContent>
        <form onSubmit={handleFormSubmit}>
          {/* Name Display */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <h4 style={{ marginRight: "10px", fontWeight: "bold", color: "#333" }}>Name:</h4>
            <span
              style={{
                padding: "5px 10px",
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
                color: "#555",
              }}
            >
              {restaurantDetails?.name || "N/A"}
            </span>
          </div>

          {/* Status Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label" shrink>
              Status
            </InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={restaurant.status}
              onChange={handleInputChange}
              fullWidth
              label="Status"
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.key} value={option.key}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Note Input Field */}
          <TextField
            label="Note"
            name="note"
            value={restaurant.note}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={3} // Allows multiline input
            placeholder="Enter a note (optional)"
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleFormSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Save Changes"}
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
  </>
);
};

export default EditRestroModal;
