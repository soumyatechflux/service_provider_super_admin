import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBannerModal from "../AddBannerModal/AddBannerModal";
import EditIcon from "@mui/icons-material/Edit";
import EditBannerModal from "../EditBannerModal/EditBannerModal"; // Import the EditBannerModal
import DeleteBannerModal from "../DeleteBannerModal/DeleteBannerModal"; // Import DeleteBannerModal
import EditStatusBannerModal from "../EditStatusBannerModal/EditStatusBannerModal"; // Import EditStatusBannerModal

const BannerTable = () => {
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusEditModal, setShowStatusEditModal] = useState(false); // New state for status modal
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [bannerToDelete, setBannerToDelete] = useState(null);

  // State to manage which banner is expanded (full description shown)
  const [expandedBanners, setExpandedBanners] = useState({});

  const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
  const baseUrl = process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL;

  // Fetch banners from the API
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/admin/cms/banners`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const bannerData = response.data.data || [];
      const formattedBanners = bannerData.map((banner) => ({
        id: banner.banner_id, // Ensure the banner_id is mapped as 'id'
        title: banner.title,
        description: banner.description,
        url: banner.url,
        image: banner.image,
        activeStatus: banner.active_status,
      }));

      setBanners(formattedBanners);
    } catch (error) {
      console.error("Error fetching banners:", error);
      alert("Failed to load banners. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDeleteClick = (bannerId) => {
    setBannerToDelete(bannerId);
    setShowDeleteModal(true);
  };

  const handleAddBanner = (formData) => {
    const newBanner = {
      id: banners.length + 1,
      image: URL.createObjectURL(formData.get("image")),
      title: formData.get("title"),
      description: formData.get("description"),
      url: formData.get("url"),
      activeStatus: "active",
    };
    setBanners([...banners, newBanner]);
  };

  const handleSaveBanner = (updatedBanner) => {
    setBanners(
      banners.map((banner) =>
        banner.id === updatedBanner.id ? updatedBanner : banner
      )
    );
  };

  const handleDeleteBanner = () => {
    setBanners(banners.filter((banner) => banner.id !== bannerToDelete));
    setShowDeleteModal(false);
  };

  const handleDeleteBannerSuccess = (deletedBannerId) => {
    setBanners(banners.filter((banner) => banner.id !== deletedBannerId));
  };

  const handleStatusChange = (id, updatedStatus) => {
    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === id ? { ...banner, activeStatus: updatedStatus } : banner
      )
    );
  };

  const toggleDescription = (id) => {
    setExpandedBanners((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle expanded state for the specific banner
    }));
  };

  return (
    <div className="Restro-Table-Main p-3">
        <h2>Banner</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive mb-5">
          <button
            className="Discount-btn"
            onClick={() => setShowAddModal(true)}
          >
            Add Banner
          </button>
          <table className="table table-bordered table-user">
            <thead>
              <tr>
                <th scope="col" style={{ width: "10%" }}>
                  Sr No.
                </th>
                <th scope="col" style={{ width: "20%" }}>
                  Title
                </th>
                <th scope="col" style={{ width: "20%" }}>
                  Banner Image
                </th>
                <th scope="col" style={{ width: "20%" }}>
                  Description
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  URL
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Status
                </th>
                <th scope="col" style={{ width: "5%" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {banners.length > 0 ? (
                banners.map((banner, index) => {
                  const words = banner.description?.split(" ") || [];
                  const visibleWords = words.slice(0, 5); // Get the first 5 words
                  const displayDescription = visibleWords.join(" ");

                  return (
                    <tr key={banner.id}>
                      <td>{index + 1}</td>
                      <td>{banner.title}</td>
                      <td>
                        <img
                          src={banner.image}
                          alt="Banner"
                          style={{ width: "100px", height: "auto" }}
                        />
                      </td>
                      <td>
                        {expandedBanners[banner.id]
                          ? banner.description
                          : `${displayDescription}...`}
                        <span
                          onClick={() => toggleDescription(banner.id)}
                          style={{
                            color: "blue",
                            cursor: "pointer",
                            marginLeft: "10px",
                          }}
                        >
                          {expandedBanners[banner.id] ? "View Less" : "View More"}
                        </span>
                      </td>
                      <td>
                        <a
                          href={banner.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {banner.url}
                        </a>
                      </td>
                      <td>
                        <div className="status-div">
                          {banner.activeStatus.charAt(0).toUpperCase() +
                            banner.activeStatus.slice(1)}
                          <EditIcon
                            style={{ cursor: "pointer", marginLeft: "10px" }}
                            onClick={() => {
                              setSelectedBanner(banner);
                              setShowStatusEditModal(true);
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="status-div">
                          <EditIcon
                            style={{ cursor: "pointer", marginRight: "10px" }}
                            onClick={() => {
                              setSelectedBanner(banner);
                              setShowEditModal(true);
                            }}
                          />
                          <DeleteIcon
                            onClick={() => handleDeleteClick(banner.id)}
                            style={{ cursor: "pointer", color: "red" }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No banners available. Please add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* AddBannerModal */}
      <AddBannerModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddBanner}
      />

      {/* EditBannerModal */}
      <EditBannerModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveBanner}
        bannerData={selectedBanner}
        fetchBanners={fetchBanners}
      />

      {/* EditStatusBannerModal */}
      <EditStatusBannerModal
        banner={selectedBanner}
        open={showStatusEditModal}
        onClose={() => setShowStatusEditModal(false)}
        onStatusChange={handleStatusChange}
        fetchBanners={fetchBanners}
      />

      {/* DeleteBannerModal */}
      <DeleteBannerModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        bannerId={bannerToDelete}
        onDeleteSuccess={handleDeleteBannerSuccess}
      />
    </div>
  );
};

export default BannerTable;
