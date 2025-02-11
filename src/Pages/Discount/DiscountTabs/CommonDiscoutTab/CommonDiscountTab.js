import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../../Loader/Loader";
import AddDiscountModal from "../CommonDiscoutTab/AddDiscountModal/AddDiscountModal";
import DeleteDiscountModal from "../CommonDiscoutTab/DeleteDiscountModal/DeleteDiscountModal";
import EditDiscountModal from "../CommonDiscoutTab/EditDiscountModal/EditDiscountModal";
import "./CommonDiscount.css";
import EditDiscountStatusModal from "./EditDiscountStatusModal/EditDiscountStatusModal";

const CommonDiscountTab = () => {
  const [discountData, setDiscountData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);

  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [itemsPerPage] = useState(10); // Items per page
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const normalizeString = (str) => {
    if (typeof str !== "string") {
      return ""; // Return an empty string for non-string values
    }
    return str.replace(/\s+/g, " ").trim().toLowerCase();
  };
  
  const formatDate = (dateString) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(dateString);
  
    if (isNaN(date)) return ""; // Handle invalid dates
  
    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2-digit day
    const month = months[date.getMonth()]; // Get month abbreviation
    const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of year
  
    return `${day} ${month} ${year}`;
  };
  
  const filteredData = discountData.filter((item) => {
    const formattedStartDate = formatDate(item.start_date);
    const formattedEndDate = formatDate(item.end_date);
  
    return (
      normalizeString(String(item.voucher_code)).includes(normalizeString(searchQuery)) ||
      normalizeString(String(item.discount_type)).includes(normalizeString(searchQuery)) ||
      normalizeString(String(item.description)).includes(normalizeString(searchQuery)) ||
      normalizeString(String(item.discount_value)).includes(normalizeString(searchQuery)) ||
      normalizeString(String(item.minimum_order_amount)).includes(normalizeString(searchQuery)) ||
      normalizeString(String(item.usage_limit)).includes(normalizeString(searchQuery)) || // Convert number to string
      normalizeString(String(item.used_count)).includes(normalizeString(searchQuery)) || // Convert number to string
      normalizeString(formattedStartDate).includes(normalizeString(searchQuery)) ||
      normalizeString(formattedEndDate).includes(normalizeString(searchQuery)) ||
      normalizeString(String(item.active_status)).includes(normalizeString(searchQuery))
    );
  });
  
  
  
  

  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleToggleDescription = (voucher_id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [voucher_id]: !prev[voucher_id],
    }));
  };

  const handleOpenStatusModal = (discount) => {
    setSelectedDiscount(discount);
    setShowEditStatusModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
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

  const handleSaveEdit = async (updatedItem) => {
    try {
      await fetchDiscountData();
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );
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

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="Discount-Table-Main p-3">
      <h2>Discount</h2>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive mb-5">
          <div
            className="mb-3"
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              className="Discount-btn mb-0"
              onClick={() => setShowAddModal(true)}
            >
              Add Discount
            </button>

            {/* Search Bar */}
            <div className="search-bar " style={{ width: "350px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by voucher code, type, or description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <table className="table table-bordered table-user">
  <thead className="heading_user">
    <tr>
      <th scope="col" style={{ width: "2%" }}>Sr.</th>
      <th scope="col" style={{ width: "10%" }}>Discount Type</th>
      <th scope="col" style={{ width: "10%" }}>Discount Value</th>
      <th scope="col" style={{ width: "8%" }}>Usage Limit</th>
      <th scope="col" style={{ width: "10%" }}>Minimum Price</th>
      <th scope="col" style={{ width: "10%" }}>Voucher Code</th>
      <th scope="col" style={{ width: "10%" }}>Start Date</th>
      <th scope="col" style={{ width: "10%" }}>End Date</th>
      <th scope="col" style={{ width: "15%" }}>Description</th>
      <th scope="col" style={{ width: "10%" }}>First Time Use</th>
      <th scope="col" style={{ width: "10%" }}>One Time Use</th>
      <th scope="col" style={{ width: "10%" }}>Status</th>
      <th scope="col" style={{ width: "10%" }}>Used Count</th>
      <th scope="col" style={{ width: "5%" }}>Action</th>
    </tr>
  </thead>
  <tbody>
    {currentItems.length > 0 ? (
      currentItems.map((item, index) => (
        <tr key={item.voucher_id}>
          <th scope="row">{index + 1}.</th>
          <td>
            {item.discount_type
              ? item.discount_type.charAt(0).toUpperCase() + item.discount_type.slice(1)
              : "N/A"}
          </td>
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
          <td>
            {expandedDescriptions[item.voucher_id]
              ? item.description
              : item.description.split(" ").slice(0, 10).join(" ") +
                (item.description.split(" ").length > 10 ? "..." : "")}
            {item.description.split(" ").length > 10 && (
              <button
                onClick={() => handleToggleDescription(item.voucher_id)}
                className="btn btn-link p-0 ms-2"
                style={{ boxShadow: "none" }}
              >
                {expandedDescriptions[item.voucher_id] ? "View Less" : "View More"}
              </button>
            )}
          </td>
          <td>{item.is_first_time_use ? "Yes" : "No"}</td>
          <td>{item.is_one_time_use ? "Yes" : "No"}</td>
          <td>
            <div className="status-div">
              <span>{item.active_status === "active" ? "Active" : "InActive"}</span>
              <EditIcon
                onClick={() => handleOpenStatusModal(item)}
                style={{ cursor: "pointer", marginLeft: "10px" }}
              />
            </div>
          </td>
          <td>{item.used_count === 0 ? "0" : item.used_count || "N/A"}</td>
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
      ))
    ) : (
      <tr>
        <td colSpan="14" className="text-center">
          No data available
        </td>
      </tr>
    )}
  </tbody>
</table>


          {/* Pagination Controls */}
          <nav>
            <ul
              className="pagination justify-content-center"
              style={{ gap: "5px" }}
            >
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, index) => (
                <li key={index} className="page-item">
                  <button
                    className={`page-link ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
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
        fetchDiscountData={fetchDiscountData}
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
        fetchDiscountData={fetchDiscountData}
      />
    </div>
  );
};

export default CommonDiscountTab;
