import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../../Loader/Loader";
import EditIcon from "@mui/icons-material/Edit";
import AddDiscountModal from "../CommonDiscoutTab/AddDiscountModal/AddDiscountModal";
import EditDiscountModal from "../CommonDiscoutTab/EditDiscountModal/EditDiscountModal";
import DeleteDiscountModal from "../CommonDiscoutTab/DeleteDiscountModal/DeleteDiscountModal";
import EditDiscountStatusModal from "../../../SubCategories/SubCategoriesTabs/EditSubCatStatusModal/EditSubCatStatusModal";
import "./CommonDiscount.css";

const CommonDiscountTab = () => {
  const [discountData, setDiscountData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);

  // Fetch discount data from the API
  const fetchDiscountData = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );

      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/discount`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      if (response?.status === 200 && response?.data?.success) {
        const data = response?.data?.data || [];
        setDiscountData(data);
      } else {
        toast.error(response.data.message || "Failed to fetch discounts.");
      }
    } catch (error) {
      toast.error("Failed to load discounts. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscountData();
  }, []);

  const handleOpenStatusModal = (discount) => {
    setSelectedDiscount(discount);
    setShowEditStatusModal(true); // Open status modal
  };

  const handleEdit = (item) => {
    setSelectedItem(item); // Set the selected discount item
    setShowEditModal(true); // Open edit modal
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleCloseModals = () => {
    setShowDeleteModal(false);
    setShowEditModal(false);
    setShowEditStatusModal(false);
    setSelectedItem(null);
    setSelectedDiscount(null);
  };
  // const handleSaveEdit = (updatedItem) => {
  //   setDiscountData((prevData) =>
  //     prevData.map((item) =>
  //       item.voucher_id === updatedItem.voucher_id ? updatedItem : item
  //     )
  //   );
    
  //   handleCloseModals();
  // };

  const handleSaveEdit = async (updatedItem) => {
    try {
      await fetchDiscountData();
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );

      // Make the API call to delete the discount using voucher_id
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/discount/${selectedItem.voucher_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200 && response?.data?.success) {
        toast.success("Discount deleted successfully!");
        setDiscountData((prevData) =>
          prevData.filter((item) => item.voucher_id !== selectedItem.voucher_id)
        );
      } else {
        toast.error(
          response?.data?.message || "Failed to delete the discount."
        );
      }
    } catch (error) {
      toast.error("Failed to delete the discount. Please try again.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="Discount-Table-Main p-3">
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive mb-5">
          <button
            className="Discount-btn"
            onClick={() => setShowAddModal(true)}
          >
            Add Discount
          </button>
          <table className="table table-bordered table-user">
            <thead className="heading_user">
              <tr>
                <th scope="col" style={{ width: "2%" }}>
                  Sr.
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Discount Type
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Discount Value
                </th>
                <th scope="col" style={{ width: "8%" }}>
                  Usage Limit
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Minimum Price
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Voucher Code
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Start Date
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  End Date
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Description
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
              {discountData.map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}.</th>
                  <td>{item.discount_type || "N/A"}</td>
                  <td>{item.discount_value || "N/A"}</td>
                  <td>{item.usage_limit || "N/A"}</td>
                  <td>{item.minimum_order_amount || "N/A"}</td>
                  <td>{item.voucher_code || "N/A"}</td>
                  <td>
                    {item.start_date
                      ? new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        }).format(new Date(item.start_date))
                      : "N/A"}
                  </td>
                  <td>
                    {item.end_date
                      ? new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        }).format(new Date(item.end_date))
                      : "N/A"}
                  </td>
                  <td>{item.description || "N/A"}</td>
                  <td>
                    <div className="status-div">
                      <span>
                        {item.active_status === "active"
                          ? "Active"
                          : "In-Active"}
                      </span>
                      <EditIcon
                        onClick={() => handleOpenStatusModal(item)}
                        style={{ cursor: "pointer", marginLeft: "10px" }}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="status-div">
                      <EditIcon
                        style={{ cursor: "pointer", marginLeft: "10px" }}
                        onClick={() => handleEdit(item)}
                      />
                      <i
                        className="fa fa-trash text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete(item)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AddDiscountModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={(newData) => {
          const newDiscountData = {
            ...newData,
            id: new Date().getTime(),
          };

          setDiscountData((prevData) => [...prevData, newDiscountData]);
          toast.success("Discount added successfully!");
        }}
        fetchDiscountData={fetchDiscountData}
      />

      <EditDiscountModal
        show={showEditModal}
        onClose={handleCloseModals}
        onSave={handleSaveEdit}
        initialData={selectedItem}
        fetchDiscountData={fetchDiscountData} // Pass fetchDiscountData as prop
      />

      <DeleteDiscountModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />

      <EditDiscountStatusModal
        open={showEditStatusModal}
        discount={selectedDiscount}
        onClose={handleCloseModals}
        onStatusChange={(status) => console.log("Edit Status", status)}
        fetchDiscountData={fetchDiscountData} // Add this prop
      />
    </div>
  );
};

export default CommonDiscountTab;
