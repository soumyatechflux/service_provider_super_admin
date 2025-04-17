import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import { Button, TextField } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../Loader/Loader";

const AddBannerModal = ({ show, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState(""); // Added state for URL
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
  const baseUrl = process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL;

  // const handleFileChange = (e) => {
  //   setImage(e.target.files[0]);
  // };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  
  //   if (file) {
  //     const fileExtension = file.name.split(".").pop().toLowerCase();
  
  //     if (fileExtension !== "webp") {
  //       toast.error("Only .webp image files are allowed.");
  //       e.target.value = null; // Reset the file input
  //       setImage(null);
  //     } else {
  //       setImage(file);
  //     }
  //   }
  // };
  


  const handleFileChange = (e) => {
    const file = e.target.files[0];
  
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      e.target.value = null;
      setImage(null);
      return;
    }
  
    const reader = new FileReader();
  
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
  
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
  
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
  
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const webpFile = new File([blob], `${file.name.split(".")[0]}.webp`, {
                type: "image/webp",
              });
  
              setImage(webpFile);
            } else {
              toast.error("Failed to convert image to .webp.");
              e.target.value = null;
              setImage(null);
            }
          },
          "image/webp",
          0.9 // Optional quality setting (0 to 1)
        );
      };
  
      img.onerror = () => {
        toast.error("Failed to load the image.");
        e.target.value = null;
        setImage(null);
      };
    };
  
    reader.onerror = () => {
      toast.error("Failed to read the image file.");
      e.target.value = null;
      setImage(null);
    };
  
    reader.readAsDataURL(file);
  };
  
  const handleSave = async () => {
    if (!title || !description || !url || !image) {
      toast.error("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("url", url); // Append URL
    formData.append("image", image);

    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/api/admin/cms/banners/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Banner added successfully!");
        onSave(formData); // Optionally pass the added banner back to the parent
        onClose();
      } else {
        toast.error("Failed to add banner. Please try again.");
      }
    } catch (error) {
      console.error("Error adding banner:", error);
      toast.error("Error occurred while adding the banner.");
    } finally {
      setLoading(false);
    }
  };

  // Reset form fields when the modal opens
  useEffect(() => {
    if (show) {
      setTitle("");
      setDescription("");
      setUrl("");
      setImage(null);
    }
  }, [show]);

  return (
    <>
      <ToastContainer />
      <Modal
        open={show}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
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
            <h2 id="modal-title" style={{ textAlign: "center" }}>
              Add Banner
            </h2>

            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label htmlFor="title" style={{ fontWeight: "bold" }}>
                Banner Title:
              </label>
              <TextField
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Enter banner title"
              />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label htmlFor="description" style={{ fontWeight: "bold" }}>
                Description:
              </label>
              <TextField
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Enter banner description"
              />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label htmlFor="url" style={{ fontWeight: "bold" }}>
                URL:
              </label>
              <TextField
                id="url"
                name="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Enter URL"
              />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label htmlFor="image" style={{ fontWeight: "bold" }}>
                Select Image:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            {/* Loader displayed here */}
            {loading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <Loader />
              </div>
            )}

            <div className="modal-actions" style={{ display: "flex", justifyContent: "space-between" }} >
              <button
                onClick={handleSave}
                className="btn btn-primary"
                disabled={loading} // Disable button when loading
                style={{width:"100%"}}
              >
                Save
              </button>
              <button onClick={onClose} className="btn btn-secondary" style={{width:"100%"}}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddBannerModal;
