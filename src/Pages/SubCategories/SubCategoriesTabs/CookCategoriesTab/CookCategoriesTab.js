import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../Loader/Loader";
import EditIcon from "@mui/icons-material/Edit";
import DeleteSubCategoryModal from "./../DeleteSubCategoryModal/DeleteSubCategoryModal";
import EditSubCatStatusModal from "./../EditSubCatStatusModal/EditSubCatStatusModal";

const CookCategoriesTab = () => {
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

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

  const handleOpenEditModal = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setShowEditModal(true);
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
          <table className="table table-bordered table-user">
            <thead className="heading_user">
              <tr>
                <th scope="col" style={{ width: "5%" }}>
                  Sr.
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Sub-Category Name
                </th>
                <th scope="col" style={{ width: "8%" }}>
                  Price
                </th>
                <th scope="col" style={{ width: "13%" }}>
                  Number of People
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
            <tbody>
              {subCategoryData.map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}.</th>
                  <td>{item.sub_category_name || "N/A"}</td>
                  <td>{item.price || "N/A"}</td>
                  <td>{item.number_of_people || "N/A"}</td>
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
        handleDelete={(subCategory) => console.log("Delete", subCategory)}
        review={selectedSubCategory}
      />

      {/* Edit Sub-Category Status Modal */}
      <EditSubCatStatusModal
        open={showEditModal} // Dynamically control visibility
        support={selectedSubCategory}
        onClose={handleCloseModals}
        onStatusChange={(status) => console.log("Edit Status", status)}
      />
    </div>
  );
};

export default CookCategoriesTab;
