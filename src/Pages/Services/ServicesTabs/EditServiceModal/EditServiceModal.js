import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import { Button, TextField } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const EditServiceModal = ({ show, onClose, onSave, service }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [subCategoryId, setSubCategoryId] = useState(""); // State for subCategoryId
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setTitle(service.title);
      setDescription(service.description);
      setImage(service.image);
      setUrl(service.url || ""); 
      setSubCategoryId(service.sub_category_id || "");
    }
  }, [service]);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSave = async () => {
    if (!title || !description) {
      toast.error("Please fill all fields.");
      return;
    }

    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

    const formData = new FormData();
    formData.append("service_id", service.id);  
    formData.append("title", title);
    formData.append("description", description);
    formData.append("url", url); 
    formData.append("sub_category_id", subCategoryId); 
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/cms/services`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);

      if (response.data.success) {
        toast.success("Service updated successfully!");
        onSave({ ...service, title, description, url, subCategoryId, image: image || service.image });
        onClose();
      } else {
        toast.error(response.data.message || "Failed to update service.");
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred while updating the service. Please try again.");
    }
  };

  return (
    <>
      {/* <ToastContainer /> */}
      <Modal open={show} onClose={onClose}>
        <div
          className="modal-overlay"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            className="modal-content"
            style={{
              padding: "20px",
              maxWidth: "600px",
              backgroundColor: "white",
              borderRadius: "8px",
              overflowY: "auto",
            }}
          >
            <h2 style={{ textAlign: "center" }}>Edit Service</h2>
            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label htmlFor="title">Service Title:</label>
              <TextField
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: "100%",
                  height: "100px",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label htmlFor="url">URL:</label>
              <TextField
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Enter service URL"
              />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label htmlFor="subCategoryId">Sub-Category ID:</label>
              <TextField
                id="subCategoryId"
                value={subCategoryId}
                disabled
                fullWidth
                variant="outlined"
                placeholder="Sub-Category ID"
              />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label htmlFor="image">Select Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "block", width: "100%" }}
              />
            </div>

            <div className="modal-actions">
              <button
                onClick={handleSave}
                type="button"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={onClose}
                type="button"
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditServiceModal;