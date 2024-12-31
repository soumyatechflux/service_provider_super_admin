import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../Loader/Loader";
import EditIcon from "@mui/icons-material/Edit";
import DeleteSubCategoryModal from "./../DeleteSubCategoryModal/DeleteSubCategoryModal";
import EditSubCatStatusModal from "./../EditSubCatStatusModal/EditSubCatStatusModal";
import AddSubCategoryModal from "../AddSubCategoryModal/AddSubCategoryModal";
import EditSubCategoryModal from "../EditSubCategoryModal/EditSubCategoryModal";

const CookCategoriesTab = ({ category_id }) => {
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [showEditSubCategoryModal, setShowEditSubCategoryModal] =useState(false);

  const fetchSubCategoryData = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );

      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/sub_category_by_category_id/1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      if (response?.status === 200 && response?.data?.success) {
        const data = response?.data?.data || [];
        setSubCategoryData(data);
      } else {
        toast.error(response.data.message || "Failed to fetch sub-categories.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Failed to load sub-categories. Please try again.");
      setLoading(false);
    }
  };

  const handleDeleteSubCategory = async (subCategory) => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );
      setLoading(true);

      const response = await axios.delete(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/sub_category/${subCategory.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200 && response?.data?.success) {
        toast.success("Sub-category deleted successfully.");
        fetchSubCategoryData(); // Refresh data after deletion
      } else {
        toast.error(response.data.message || "Failed to delete sub-category.");
      }
    } catch (error) {
      toast.error("Error deleting sub-category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setShowEditModal(true);
  };

  const handleOpenEditSubCategoryModal = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setShowEditSubCategoryModal(true);
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleOpenDeleteModal = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setShowDeleteModal(true);
  };

  const handleCloseModals = () => {
    setShowDeleteModal(false);
    setShowEditModal(false);
    setSelectedSubCategory(null);
  };

  useEffect(() => {
    fetchSubCategoryData();
  }, []);

  return (
    <div className="SubCategory-Table-Main p-3">
      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive mb-5">
          <button
            className="Discount-btn mb-3"
            onClick={() => setShowAddModal(true)}
          >
            Add Sub Category
          </button>
          <table className="table table-bordered table-user">
            {/* // Inside the <thead> section */}
            <thead className="heading_user">
              <tr>
                <th scope="col" style={{ width: "5%" }}>
                  Sr.
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Sub-Category Name
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Image
                </th>
                {/* New column header */}
                <th scope="col" style={{ width: "8%" }}>
                  Price
                </th>
                <th scope="col" style={{ width: "20%" }}>
                  Description
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Active Status
                </th>
                <th scope="col" style={{ width: "9%" }}>
                  Created At
                </th>
                <th scope="col" style={{ width: "9%" }}>
                  Updated At
                </th>
                <th scope="col" style={{ width: "5%" }}>
                  Action
                </th>
              </tr>
            </thead>

            {/* // Inside the <tbody> section */}
            <tbody>
              {subCategoryData.map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}.</th>
                  <td>{item.sub_category_name || "N/A"}</td>
                  <td>
                  {item.image ? (
                <img
                  src={item.image} // Ensure this is the correct image URL
                  alt={item.subCategoryName}
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              ) : (
                "No image"
              )}
                  </td>
                  {/* New image cell */}
                  <td>{item.price || "N/A"}</td>
                  <td>{item.description || "No description available."}</td>
                  <td>
                    <div className="status-div">
                      <span>
                        {item.active_status === "active"
                          ? "Active"
                          : "In-Active"}
                      </span>
                      <EditIcon
                        onClick={() => handleOpenEditModal(item)}
                        style={{ cursor: "pointer", marginLeft: "10px" }}
                      />
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
                  <td className="action-btn-trash">
                    <i
                      className="fa fa-trash text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleOpenDeleteModal(item)}
                    ></i>
                    <EditIcon
                      style={{
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "21px",
                      }}
                      onClick={() => handleOpenEditSubCategoryModal(item)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Sub-Category Modal */}
      <DeleteSubCategoryModal
        show={showDeleteModal}
        handleClose={handleCloseModals}
        handleDelete={handleDeleteSubCategory}
        subCategory={selectedSubCategory}
      />

      {/* Edit Sub-Category Status Modal */}
      <EditSubCatStatusModal
        subCategory={selectedSubCategory} // Pass the full object here
        open={showEditModal}
        onClose={handleCloseModals}
        onStatusChange={(newStatus) =>
          console.log("Status Changed:", newStatus)
        }
        fetchSubCategoryData={fetchSubCategoryData}
      />

      {/* Add Sub-Category Modal */}
      <AddSubCategoryModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={fetchSubCategoryData}
        category_id={category_id} // Pass category_id to the modal
      />

      <EditSubCategoryModal
        open={showEditSubCategoryModal}
        onClose={() => setShowEditSubCategoryModal(false)}
        onSubmit={fetchSubCategoryData} // Refresh data after saving
        initialData={selectedSubCategory}
      />
    </div>
  );
};

export default CookCategoriesTab;
