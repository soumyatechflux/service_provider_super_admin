import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";
import EditIcon from "@mui/icons-material/Edit";
import EditCategoriesModal from "./../CategoriesTable/EditCategoriModal/EditCategoriModal"; // Import the modal

const CategoriesTable = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategoryData = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );

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

  useEffect(() => {
    fetchCategoryData();
  }, []);

  return (
    <div className="Category-Table-Main p-3">
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
                  Active Status
                </th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}.</th>
                  <td>{item.category_name || "N/A"}</td>
                  <td>{item.description || "No description available."}</td>
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
                </tr>
              ))}
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
    </div>
  );
};

export default CategoriesTable;

