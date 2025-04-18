import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { toast } from "react-toastify"; // Importing toast
import axios from "axios";
import Loader from "../../Loader/Loader";

const EditBannerModal = ({ show, onClose, onSave, bannerData, fetchBanners }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    image: null,
  });
  const [loading, setLoading] = useState(false); // Loading state for the loader

  const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
  const baseUrl = process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL;

  useEffect(() => {
    if (show && bannerData) {
      setFormData({
        title: bannerData.title || "",
        description: bannerData.description || "",
        url: bannerData.url || "",
        image: null, // Reset image for new selection
      });
    }
  }, [show, bannerData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleImageChange = (e) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     image: e.target.files[0], // Update image state when a new file is selected
  //   }));
  // };


  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  
  //   if (file && file.type !== "image/webp") {
  //     toast.error("Only .webp image files are allowed.");
  //     return;
  //   }
  
  //   setFormData((prev) => ({
  //     ...prev,
  //     image: file,
  //   }));
  // };

  const convertImageToWebP = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
  
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
  
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
  
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const webpFile = new File([blob], "converted_image.webp", {
                  type: "image/webp",
                });
                resolve(webpFile);
              } else {
                reject(new Error("Conversion to WebP failed"));
              }
            },
            "image/webp",
            0.9 // quality: 0–1 (adjust as needed)
          );
        };
  
        img.onerror = (err) => reject(err);
      };
  
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, or WEBP image files are allowed.");
      return;
    }
  
    try {
      const convertedWebpFile = await convertImageToWebP(file);
      setFormData((prev) => ({
        ...prev,
        image: convertedWebpFile,
      }));
    } catch (error) {
      toast.error("Failed to convert image to .webp format.");
      console.error(error);
    }
  };
  
  
  const handleSave = async () => {
    setLoading(true); // Start loader
    const updatedBanner = new FormData();
    updatedBanner.append("banner_id", bannerData.id);
    updatedBanner.append("title", formData.title);
    updatedBanner.append("description", formData.description);
    updatedBanner.append("url", formData.url);

    if (formData.image) {
      updatedBanner.append("image", formData.image);
    }

    try {
      const response = await axios.patch(
        `${baseUrl}/api/admin/cms/banners`,
        updatedBanner,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Banner updated successfully!"); // Toast on success
      onSave(response.data);
      onClose();
      fetchBanners(); // Refresh the banner list after saving
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error("Failed to update banner. Please try again."); // Toast on error
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      url: "",
      image: null,
    });
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ height: "80%", overflowY: "auto" }}>
        {loading ? ( // Show loader when loading
          <Loader/> // Replace this with your loader component
        ) : (
          <>
            <h2>Edit Banner</h2>
            <div className="form-group">
              <label htmlFor="title">Banner Title:</label>
              <TextField
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter banner title"
                fullWidth
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <TextField
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter banner description"
                fullWidth
              />
            </div>

            <div className="form-group">
              <label htmlFor="url">Banner URL:</label>
              <TextField
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="Enter banner URL"
                fullWidth
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Banner Image:</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              {formData.image ? (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  style={{ width: "100%", height: "auto", marginTop: "10px" }}
                />
              ) : bannerData?.image ? (
                <img
                  src={bannerData.image}
                  alt="Current"
                  style={{ width: "100%", height: "auto", marginTop: "10px" }}
                />
              ) : null}
            </div>

            <div className="modal-actions">
              <button onClick={handleSave} className="btn btn-primary" style={{width:"100%"}}>
                Save
              </button>
              <button onClick={handleCancel} className="btn btn-secondary" style={{width:"100%"}}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditBannerModal;
