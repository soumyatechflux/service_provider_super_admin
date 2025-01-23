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
import axios from "axios"; // Import axios for API calls
import React, { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";

const EditCustomerModal = ({
  show,
  handleClose,
  restaurantDetails,
  getRestaurantTableData,
}) => {
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState({
    status: restaurantDetails?.active_status,
  });

  const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

  const statusOptions = [
    { key: "active", label: "Active" },
    { key: "inactive", label: "InActive" },
  ];

  const handleStatusChange = (e) => {
    setRestaurant({ ...restaurant, status: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      customer: {
        customer_id: restaurantDetails?.id,
        active_status: restaurant.status,
      },
    };

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/customers/status`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.data?.success) {
        toast.success(
          response.data.message || "Customer status updated successfully!"
        );
        getRestaurantTableData();
        handleClose();
      } else {
        toast.error(
          response.data?.message || "Failed to update. Please try again."
        );
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <h4
                style={{
                  marginRight: "10px",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Name:
              </h4>
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
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label" shrink>
                Status
              </InputLabel>
              <Select
                labelId="status-label"
                value={restaurant.status}
                onChange={handleStatusChange}
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

export default EditCustomerModal;
