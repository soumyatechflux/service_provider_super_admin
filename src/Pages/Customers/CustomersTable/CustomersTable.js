import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../Loader/Loader";
import EditIcon from "@mui/icons-material/Edit";
import EditCustomerModal from "../EditCustomersModal/EditCustomersModal";
import "../../Customers/CustomersTable/CustomersTable.css";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteCustomerModal from "../DeleteCustomerModal/DeleteCustomerModal";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Import eye icon
import CustomerInfoModal from "./CustomerInfoModal/CustomerInfoModal";

const CustomersTable = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [customerToDelete, setCustomerToDelete] = useState(null);
const [selectedCustomer, setSelectedCustomer] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);

const handleViewCustomer = async (customerId) => {
  try {
    setLoading(true);
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

    const response = await axios.get(
      `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/customers/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setLoading(false);

    if (response?.data?.message === "Customer fetched successfully") {
      setSelectedCustomer(response?.data?.data); // Set fetched data
      setIsModalOpen(true); // Open modal
    } else {
      toast.error(response?.data?.message || "Failed to load customer details.");
    }
  } catch (error) {
    setLoading(false);
    console.error("Error fetching customer details:", error);
    toast.error("Failed to load customer details. Please try again.");
  }
};



  const entriesPerPage = 10;

  // Fetch restaurant data with error handling
  const getRestaurantTableData = useCallback(async () => {

    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );

      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/customers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      if (response?.data?.message === "customers fetched successfully") {
        setRestaurants(response?.data?.data || []);
        setFilteredRestaurants(response?.data?.data || []);
      } else {
        toast.error(response.data.message || "Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching customers data:", error);
      toast.error("Failed to load customers data. Please try again.");
    }
  }, []);

    const handleDeleteCustomer = async (customer) => {
      try {
        const token = sessionStorage.getItem(
          "TokenForSuperAdminOfServiceProvider"
        );
  
        const response = await axios.delete(
          `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/customers/${customer.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response?.data?.message === "Customer deleted successfully") {
          toast.success("Customer deleted successfully.");
          getRestaurantTableData(); // Refresh the table data
        } else {
          toast.error(response?.data?.message || "Failed to delete customer.");
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
        toast.error("Failed to delete customer. Please try again.");
      }
    };

    const handleDeleteClick = (customer) => {
      setCustomerToDelete(customer);
      setShowDeleteModal(true);
    };

  useEffect(() => {
    getRestaurantTableData();
  }, [getRestaurantTableData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput]);
  
  useEffect(() => {
    // Normalize function to trim spaces and convert to lowercase
    const normalizeString = (str) =>
      str?.toString().replace(/\s+/g, " ").trim().toLowerCase() || "";
  
    const searchTerm = normalizeString(searchInput);
  
    const filteredData = restaurants.filter((restaurant) => {
      return (
        normalizeString(restaurant.name).includes(searchTerm) ||
        normalizeString(restaurant.email ?? "").includes(searchTerm) ||
        normalizeString(restaurant.mobile ?? "").includes(searchTerm) ||
        normalizeString(restaurant.id ?? "").includes(searchTerm) ||
        normalizeString(restaurant.uid ?? "").includes(searchTerm) ||
        normalizeString(restaurant.gender ?? "").includes(searchTerm) ||
        normalizeString(restaurant.address ?? "").includes(searchTerm) ||
        normalizeString(restaurant.rating?.toString() ?? "").includes(searchTerm) ||
        normalizeString(restaurant.active_status ?? "").includes(searchTerm) 
      );
    });
    
    setFilteredRestaurants(filteredData);
  }, [searchInput, restaurants]);
  
  

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedRestaurant(null);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredRestaurants.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredRestaurants.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const getPageRange = () => {
    let start = currentPage - 1;
    let end = currentPage + 1;

    if (start < 1) {
      start = 1;
      end = Math.min(3, totalPages);
    }

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, totalPages - 2);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const renderPaginationItems = () => {
    const pageRange = getPageRange();

    return (
      <ul className="pagination mb-0" style={{ gap: "5px" }}>
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => setCurrentPage(1)}
            style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
          >
            First
          </button>
        </li>

        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
          >
            Previous
          </button>
        </li>

        {pageRange.map((number) => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? "active" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => setCurrentPage(number)}
              style={{
                backgroundColor: currentPage === number ? "#007bff" : "white",
                color: currentPage === number ? "white" : "#007bff",
              }}
            >
              {number}
            </button>
          </li>
        ))}

        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            style={{
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next
          </button>
        </li>

        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => setCurrentPage(totalPages)}
            style={{
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Last
          </button>
        </li>
      </ul>
    );
  };

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  return (
    <div className="Restro-Table-Main p-3">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="table-responsive mb-5">
            <div className="d-flex justify-content-between align-items-center">
              <h2>Customers</h2>
              <input
                type="text"
                className="form-control search-input w-25"
                placeholder="Search customers..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <table className="table table-bordered table-user">
  <thead>
    <tr>
      <th scope="col" style={{ width: "5%" }}>Sr.</th>
      <th scope="col" style={{ width: "10%" }}>Customer Id</th>
      <th scope="col" style={{ width: "10%" }}>Name</th>
      <th scope="col" style={{ width: "15%" }}>Email</th>
      <th scope="col" style={{ width: "10%" }}>Phone</th>
      {/* <th scope="col" style={{ width: "10%" }}>Gender</th> */}
      {/* <th scope="col" style={{ width: "10%" }}>Address</th> */}
      <th scope="col" style={{ width: "5%" }}>Rating</th>
      <th scope="col" style={{ width: "10%" }}>Status</th>
      <th scope="col" style={{ width: "5%" }}>Action</th>
      <th scope="col" style={{ width: "5%" }}>View</th> 
    </tr>
  </thead>
  <tbody>
    {currentEntries.map((restaurant, index) => (
      <tr key={restaurant.id}>
        <th scope="row">{indexOfFirstEntry + index + 1}.</th>
        <td>{restaurant?.id || "NA"}</td>
        <td>{restaurant.name ? restaurant.name.charAt(0).toUpperCase() + restaurant.name.slice(1) : "N/A"}</td>
        <td>{restaurant.email || "NA"}</td>
        <td>{restaurant.mobile}</td>
        {/* <td>{restaurant.gender ? restaurant.gender : "Not Provided"}</td> */}
        {/* <td>{restaurant.address ? restaurant.address : "Not Provided"}</td> */}
        <td>{restaurant.rating}</td>
        <td className={`status ${restaurant.active_status}`}>
          <div className="status-div" onClick={() => handleRestaurantClick(restaurant)} style={{ cursor: "pointer" }}>
            <span>{restaurant.active_status.charAt(0).toUpperCase() + restaurant.active_status.slice(1)}</span>
            <EditIcon />
          </div>
        </td>
        <td className="edit_users action-btn-trash" style={{ cursor: "pointer", opacity: 1 }} onClick={() => handleDeleteClick(restaurant)}>
          <DeleteIcon style={{ color: "red" }} />
        </td>
        <td style={{ cursor: "pointer" }} onClick={() => handleViewCustomer(restaurant.id)}>
  <VisibilityIcon style={{ color: "#007bff" }} />
</td>


      </tr>
    ))}
  </tbody>
</table>
          </div>

          {/* Pagination Controls */}
          <nav
            aria-label="Page navigation"
            className="d-flex justify-content-center"
          >
            {renderPaginationItems()}
          </nav>
        </>
      )}

{isModalOpen && selectedCustomer && (
  <CustomerInfoModal 
    customer={selectedCustomer} 
    onClose={() => setIsModalOpen(false)} 
  />
)}



 {showDetailsModal && (
        <EditCustomerModal
          show={showDetailsModal}
          handleClose={handleCloseDetailsModal}
          restaurantDetails={selectedRestaurant}
          getRestaurantTableData={getRestaurantTableData}
        />
      )}
<DeleteCustomerModal
  show={showDeleteModal}
  handleClose={() => setShowDeleteModal(false)}
  handleDelete={handleDeleteCustomer}
  customer={customerToDelete}
/>
    </div>
  );
};

export default CustomersTable;