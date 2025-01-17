import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";
import EditIcon from "@mui/icons-material/Edit";
import EditCategoriesModal from "./../CategoriesTable/EditCategoriModal/EditCategoriModal"; // Import the modal
import EditDescriptionModal from "./../CategoriesTable/EditDescriptionModal/EditDescriptionModal"; // Import the EditDescriptionModal

const CategoriesTable = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false); // State to handle EditDescriptionModal
  const [selectedCategory, setSelectedCategory] = useState(null);

  // New state to manage "View More / View Less" functionality
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const fetchCategoryData = async () => {
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/category`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      if (response?.status === 200 && response?.data?.success) {
        const data = response?.data?.data || [];
        setCategoryData(data);
      } else {
        toast.error(response.data.message || "Failed to fetch categories.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Failed to load categories. Please try again.");
      setLoading(false);
    }
  };

  const handleEditStatus = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };

  // Handle the toggling of description visibility (View More / View Less)
  const handleToggleDescription = (index) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Handle the opening of EditDescriptionModal
  const handleEditDescription = (category) => {
    setSelectedCategory(category);
    setShowDescriptionModal(true);
  };

  const handleCloseDescriptionModal = () => {
    setShowDescriptionModal(false);
    setSelectedCategory(null);
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  return (
    <div className="Category-Table-Main p-3">
      <h2>categories</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive mb-5">
          <table className="table table-bordered table-user">
            <thead className="heading_user">
              <tr>
                <th scope="col" style={{ width: "5%" }}>
                  Sr.
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Category Name
                </th>
                <th scope="col" style={{ width: "30%" }}>
                  Description
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Created At
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Updated At
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Status
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((item, index) => {
                const descriptionWords = item.description?.split(" ") || [];
                const truncatedDescription =
                  descriptionWords.slice(0, 10).join(" "); // Truncate to 5 words
                const showFullDescription = expandedDescriptions[index];

                return (
                  <tr key={item.id}>
                    <th scope="row">{index + 1}.</th>
                    <td>{item.category_name || "N/A"}</td>
                    <td>
                      <div>
                        {item.description && item.description.trim() !== ""
                          ? showFullDescription
                            ? item.description
                            : `${truncatedDescription}...`
                          : "No description available"}
                        {item.description && item.description.trim() !== "" && descriptionWords.length > 10 && (
                          <span
                            onClick={() => handleToggleDescription(index)}
                            style={{ color: "#007bff", cursor: "pointer", marginLeft: "5px" }}
                          >
                            {showFullDescription ? "View Less" : "View More"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(item.created_at))}
                    </td>
                    <td>
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(item.updated_at))}
                    </td>
                    <td>
                      <div className="status-div">
                        <span>
                          {item.active_status === "active"
                            ? "Active"
                            : "In-Active"}
                        </span>
                        <EditIcon
                          onClick={() => handleEditStatus(item)}
                          style={{ cursor: "pointer", marginLeft: "10px" }}
                        />
                      </div>
                    </td>
                    <td>
                      <EditIcon
                        onClick={() => handleEditDescription(item)} // Open the edit description modal
                        style={{ cursor: "pointer", marginLeft: "10px" }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <EditCategoriesModal
          category={selectedCategory}
          onClose={handleCloseModal}
          onStatusUpdateSuccess={fetchCategoryData}
        />
      )}
      {showDescriptionModal && (
        <EditDescriptionModal
          show={showDescriptionModal}
          onClose={handleCloseDescriptionModal}
          initialData={selectedCategory}
          fetchCategoryData={fetchCategoryData}
        />
      )}
    </div>
  );
};

export default CategoriesTable;
