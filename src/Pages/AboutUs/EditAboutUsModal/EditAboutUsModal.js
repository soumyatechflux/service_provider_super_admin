import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";

const EditAboutUsModal = ({ open, onClose, onSubmit, initialData, fetchAboutUsData }) => {
  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    description1: "",
    description2: "",
    ourMissionDescription: "",
    counter1: "",
    counter2: "",
    counter3: "",
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const [imagePreviews, setImagePreviews] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        subTitle: initialData.sub_title || "",
        description1: initialData.description1 || "",
        description2: initialData.description2 || "",
        ourMissionDescription: initialData.our_mission_description || "",
        counter1: initialData.counter1 || "",
        counter2: initialData.counter2 || "",
        counter3: initialData.counter3 || "",
        image1: null,
        image2: null,
        image3: null,
        image4: null,
      });

      setImagePreviews({
        image1: initialData.image1 || null,
        image2: initialData.image2 || null,
        image3: initialData.image3 || null,
        image4: initialData.image4 || null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, [name]: file }));
    setImagePreviews((prev) => ({
      ...prev,
      [name]: file ? URL.createObjectURL(file) : null,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

      const payload = new FormData();
      payload.append("id", initialData.id);
      payload.append("title", formData.title);
      payload.append("sub_title", formData.subTitle);
      payload.append("description1", formData.description1);
      payload.append("description2", formData.description2);
      payload.append("our_mission_description", formData.ourMissionDescription);
      payload.append("counter1", formData.counter1);
      payload.append("counter2", formData.counter2);
      payload.append("counter3", formData.counter3);
      if (formData.image1) {
        payload.append("image1", formData.image1);
      }
      if (formData.image2) {
        payload.append("image2", formData.image2);
      }
      if (formData.image3) {
        payload.append("image3", formData.image3);
      }
      if (formData.image4) {
        payload.append("image4", formData.image4);
      }

      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/cms/about_us`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.status === 200 && response?.data?.success) {
        toast.success("About Us data updated successfully.");
        onSubmit();
        onClose();
        fetchAboutUsData();
      } else {
        toast.error(response?.data?.message || "Failed to update About Us data.");
      }
    } catch (error) {
      toast.error("Error updating About Us data. Please try again.");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: "900px",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          height: "90vh",
          overflowY: "auto",
        }}
      >
        <h2>Edit About Us Data</h2>

        <TextField
          id="title"
          name="title"
          label="Title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          margin="dense"
          variant="outlined"
        />

        <TextField
          id="subTitle"
          name="subTitle"
          label="Sub Title"
          value={formData.subTitle}
          onChange={handleChange}
          fullWidth
          margin="dense"
          variant="outlined"
        />

        <TextField
          id="description1"
          name="description1"
          label="Description 1"
          value={formData.description1}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
          margin="dense"
          variant="outlined"
        />

        <TextField
          id="description2"
          name="description2"
          label="Description 2"
          value={formData.description2}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
          margin="dense"
          variant="outlined"
        />

        <TextField
          id="ourMissionDescription"
          name="ourMissionDescription"
          label="Our Mission"
          value={formData.ourMissionDescription}
          onChange={handleChange}
          fullWidth
          margin="dense"
          variant="outlined"
        />

        <TextField
          id="counter1"
          name="counter1"
          label="People Served"
          value={formData.counter1}
          onChange={handleChange}
          fullWidth
          margin="dense"
          variant="outlined"
        />
        <TextField
          id="counter2"
          name="counter2"
          label="Trained Professionals"
          value={formData.counter2}
          onChange={handleChange}
          fullWidth
          margin="dense"
          variant="outlined"
        />
        <TextField
          id="counter3"
          name="counter3"
          label="Cities"
          value={formData.counter3}
          onChange={handleChange}
          fullWidth
          margin="dense"
          variant="outlined"
        />

        {["image1", "image2", "image3", "image4"].map((imageKey, index) => (
          <div key={index} style={{ marginTop: "16px", marginBottom: "16px" }}>
            <input
              type="file"
              id={imageKey}
              name={imageKey}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "block" }}
            />
            {imagePreviews[imageKey] && (
              <img
                src={imagePreviews[imageKey]}
                alt={`Preview ${index + 1}`}
                style={{ maxWidth: "100px", marginTop: "10px" }}
              />
            )}
          </div>
        ))}

        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            onClick={onClose}
            variant="contained"
            color="error"
            style={{ marginLeft: 8 }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditAboutUsModal;
