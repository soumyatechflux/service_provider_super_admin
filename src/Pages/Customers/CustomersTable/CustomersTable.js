import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../Loader/Loader";
import EditIcon from "@mui/icons-material/Edit";
import EditCustomerModal from "../EditCustomersModal/EditCustomersModal";

const CustomersTable = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const entriesPerPage = 10;

  // Fetch restaurant data with error handling
  const getRestaurantTableData = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

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
      } else {
        toast.error(response.data.message || "Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching customers data:", error);
      toast.error("Failed to load customers data. Please try again.");
    }
  }, []);

  useEffect(() => {
    getRestaurantTableData();
  }, [getRestaurantTableData]);

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedRestaurant(null);
  };

  // Pagination logic
  const totalPages = Math.ceil(restaurants.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = restaurants.slice(indexOfFirstEntry, indexOfLastEntry);

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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            style={{ cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
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
            style={{ cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
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
      behavior: "smooth", // Enables smooth scrolling
    });
  }, [currentPage]);
  
  return (
    <div className="Restro-Table-Main p-3">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="table-responsive mb-5">
          <h2>Customers</h2>
            <table className="table table-bordered table-user">
              <thead>
                <tr>
                  <th scope="col" style={{ width: "5%" }}>Sr.</th>
                  <th scope="col" style={{ width: "15%" }}>Name</th>
                  <th scope="col" style={{ width: "15%" }}>Email</th>
                  <th scope="col" style={{ width: "10%" }}>Phone</th>
                  <th scope="col" style={{ width: "10%" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((restaurant, index) => (
                  <tr key={restaurant.id}>
                    <th scope="row">{indexOfFirstEntry + index + 1}.</th>
                    <td>{restaurant.name}</td>
                    <td>{restaurant.email || "-"}</td>
                    <td>{restaurant.mobile}</td>
                    <td className={`status ${restaurant.active_status}`}>
                      <div
                        className="status-div"
                        onClick={() => handleRestaurantClick(restaurant)}
                        style={{ cursor: "pointer" }}
                      >
                        <span>
                          {restaurant.active_status.charAt(0).toUpperCase() + restaurant.active_status.slice(1)}
                        </span>
                        <EditIcon />
                      </div>
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

      {showDetailsModal && (
        <EditCustomerModal
          show={showDetailsModal}
          handleClose={handleCloseDetailsModal}
          restaurantDetails={selectedRestaurant}
          getRestaurantTableData={getRestaurantTableData}
        />
      )}
    </div>
  );
};

export default CustomersTable;
