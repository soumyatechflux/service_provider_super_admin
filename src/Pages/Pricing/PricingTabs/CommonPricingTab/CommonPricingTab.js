import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../Loader/Loader";
import EditIcon from "@mui/icons-material/Edit";
import DeletePricingModal from "./DeletePricingModal/DeletePricingModal";
import AddPricingModal from "./AddPricingModal/AddPricingModal";
import EditPricingModal from "./EditPricingModal/EditPricingModal";
import { Row } from "react-bootstrap";

const CommonPricingTab = () => {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false); // State for showing/hiding the edit modal
  const [selectedPricingData, setSelectedPricingData] = useState(null); // State for the pricing data to be edited

  const fetchPricingData = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );

      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/sub_category_by_category_id/aaaaaaaaaaaaaaaaaaaaaaa`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      if (response?.status === 200 && response?.data?.success) {
        const data = response?.data?.data || [];
        setPricingData(data);
      } else {
        toast.error(response.data.message || "Failed to fetch pricing.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Failed to load pricing. Please try again.");
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (item) => {
    setSelectedSubCategory(item);
    setShowDeleteModal(true);
  };

  const handleDeletepricing = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/delete_sub_category/${selectedSubCategory.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200 && response?.data?.success) {
        toast.success("Sub-category deleted successfully.");
        fetchPricingData(); // Refresh the data after deletion
      } else {
        toast.error(response.data.message || "Failed to delete pricing.");
      }
    } catch (error) {
      toast.error("Failed to delete pricing. Please try again.");
    } finally {
      setShowDeleteModal(false);
      setSelectedSubCategory(null);
    }
  };

  const handleCloseModals = () => {
    setShowDeleteModal(false);
    setSelectedSubCategory(null);
    setShowAddModal(false);
  };

  const handleAddPricing = (newData) => {
    setPricingData((prevData) => [
      ...prevData,
      { id: Date.now().toString(), ...newData },
    ]);
    setShowAddModal(false);
  };

  const handleEditButtonClick = (row) => {
    setSelectedPricingData(row); // Set the data to be edited
    setShowEditModal(true); // Show the modal
  };

  // Close the Edit Modal
  const handleCloseEditModal = () => {
    setShowEditModal(false); // Hide the modal
    setSelectedPricingData(null); // Reset selected data
  };

  // Save the edited data
  const handleEditPricing = (updatedData) => {
    // Update the data in the pricing table
    setPricingData((prevData) =>
      prevData.map((item) =>
        item.id === updatedData.id ? { ...item, ...updatedData } : item
      )
    );
    handleCloseEditModal(); // Close the modal
  };

  useEffect(() => {
    fetchPricingData();
  }, []);

  return (
    <div className="SubCategory-Table-Main p-3">
      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive mb-5">
          <button
            className="Discount-btn mb-4"
            onClick={() => setShowAddModal(true)}
          >
            Add Pricing
          </button>
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
                <th scope="col" style={{ width: "15%" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {pricingData.map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}.</th>
                  <td>{item.sub_category_name || "N/A"}</td>
                  <td>{item.price || "N/A"}</td>
                  <td>{item.number_of_people || "N/A"}</td>
                  <td>{item.description || "No description available."}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <i
                        className="fa fa-trash text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleOpenDeleteModal(item)}
                      ></i>
                      <EditIcon
                        onClick={() => handleEditButtonClick(Row)}
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

      {/* Delete Sub-Category Modal */}
      <DeletePricingModal
        show={showDeleteModal}
        handleClose={handleCloseModals}
        handleDelete={handleDeletepricing}
        subCategory={selectedSubCategory}
      />

      {/* Add Pricing Modal */}
      <AddPricingModal
        show={showAddModal}
        onClose={handleCloseModals}
        onSave={handleAddPricing}
        subCategoryOptions={[
          { value: "basic_cleaning", label: "Basic Cleaning" },
          { value: "deep_cleaning", label: "Deep Cleaning" },
          { value: "office_cleaning", label: "Office Cleaning" },
        ]}
      />
      <EditPricingModal
        show={showEditModal}
        onClose={handleCloseEditModal}
        onSave={handleEditPricing}
        pricingData={selectedPricingData} // Pass the data to be edited
        subCategoryOptions={[
          { value: "basic_cleaning", label: "Basic Cleaning" },
          { value: "deep_cleaning", label: "Deep Cleaning" },
          { value: "office_cleaning", label: "Office Cleaning" },
        ]}
      />
    </div>
  );
};

export default CommonPricingTab;
