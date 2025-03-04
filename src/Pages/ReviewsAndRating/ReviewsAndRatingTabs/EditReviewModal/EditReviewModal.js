import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const EditReviewModal = ({ open, onClose, review, fetchReviews }) => {
  const [rating, setRating] = useState(review?.rating || "");
  const [reviewText, setReviewText] = useState(review?.review || "");
  const [comment, setComment] = useState(review?.comment || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(review?.customer?.image || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (review) {
      setRating(review.rating || "");
      setReviewText(review.review || "");
      setComment(review.comment || "");
      setPreview(review.attachment || ""); 
    }
  }, [review, open]);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL); // Update preview state when a new file is selected
    }
  };
  
  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
      const formData = new FormData();
      formData.append("id", review?.id);
      formData.append("rating", rating);
      formData.append("review", reviewText);
      formData.append("comment", comment);
      if (image) {
        formData.append("attachment", image);
      }
  
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/update_ratings`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );
  
      if (response?.status === 200 && response?.data?.success) {
        toast.success("Review updated successfully!");
        fetchReviews();
  
        // Update preview with the new image URL from the response
        setPreview(response.data.updatedReview?.attachment || preview);
      } else {
        toast.error(response.data.message || "Failed to update review.");
      }
    } catch (error) {
      console.error("API Error:", error.response?.data);
      toast.error("Error updating review. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };
  
  

  const handleCancel = () => {
    setRating(review?.rating || "");
    setReviewText(review?.review || "");
    setComment(review?.comment || "");
    setPreview(review?.customer?.image || "");
    setImage(null);
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
      <DialogTitle>Edit Review Status</DialogTitle>
      <DialogContent>
        <TextField
          label="Rating"
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={1}
        />

        <TextField
          label="Review"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />

        

        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <img src={preview} alt="Preview" style={{ width: "100%", marginBottom: "10px", display: "block" }} />
        )}

        <TextField
          label="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={2}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleStatusUpdate} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Save"}
        </Button>
        <Button
          variant="outlined"
          onClick={handleCancel}
          style={{ backgroundColor: "rgb(223, 22, 22)", color: "white" }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditReviewModal;