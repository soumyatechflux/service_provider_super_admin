import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../../Loader/Loader";
import VerifyChef from "../../../VerifyPartners/VerifyChef/VerifyChef";
import AddPartnerModal from "../AddPartner/AddPartnerModal"; // Import AddPartnerModal component
import DeletePartnerModal from "../DeletePartnerModal/DeletePartnerModal";
import EditRestroModal from "../EditRestroModal/EditRestroModal";
import VerifyModal from "../VerifyModal/VerifyModal";

const VerifiedPartnerTab = ({
  restaurants,
  setRestaurants,
  loading,
  setLoading,
  showDetailsModal,
  ShowVerifyModal,
  selectedId,
  selectedRestaurant,
  handleRestaurantClick,
  handleCloseDetailsModal,
  handleVerifyClick,
  handleCloseVerifyModal,
  handleNavigateToVerifyCook,
  showDeleteModal,
  setShowDeleteModal,
  partnerToDelete,
  setPartnerToDelete,
  handleDeleteClick,
}) => {
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;
  const [searchInput, setSearchInput] = useState("");
  
  

  const getRestaurantTableData = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );

      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/partners`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);

      if (response?.data?.message === "partners fetched successfully") {
        const data = response?.data?.data || [];
        setRestaurants(data);
      } else {
        toast.error(response.data.message || "Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching partners data:", error);
      toast.error("Failed to load partners data. Please try again.");
      setLoading(false);
    }
  };

  const handleDeletePartner = async (partner) => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );

      const response = await axios.delete(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/partners/${partner.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.message === "Partner deleted successfully") {
        toast.success("Partner deleted successfully.");
        getRestaurantTableData(); // Refresh the table data
      } else {
        toast.error(response?.data?.message || "Failed to delete partner.");
      }
    } catch (error) {
      console.error("Error deleting partner:", error);
      toast.error("Failed to delete partner. Please try again.");
    }
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(restaurants.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredRestaurants.slice(indexOfFirstEntry, indexOfLastEntry);

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

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [restaurants]);

  const renderPaginationItems = () => {
    if (!restaurants?.length) return null;

    const pageRange = getPageRange();

    return (
      <ul className="pagination mb-0" style={{ gap: "5px" }}>
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
        </li>

        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
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
            disabled={currentPage === totalPages}
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
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </li>
      </ul>
    );
  };

  // Fetch data on component mount
  useEffect(() => {
    getRestaurantTableData();
  }, []);

  useEffect(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Enables smooth scrolling
      });
    }, [currentPage]);
    
  return (
    <div className="Restro-Table-Main p-3">
    
<div className="d-flex justify-content-between align-items-center">
<h2>
  {restaurants.filter((restaurant) => restaurant.is_verify === 0).length > 0
    ? "Unverified Partners"
    : restaurants.filter((restaurant) => restaurant.is_verify === 1).length > 0
    ? "Verified Partners"
    : "No Partners Available"}
</h2>
              <input
                type="text"
                className="form-control search-input w-25"
                placeholder="Search customers..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

      <div style={{ float: "right" }}>
        {restaurants.filter((restaurant) => restaurant.is_verify === 0).length >
          0 || restaurants.length === 0 ? (
          <button
            className="Discount-btn"
            onClick={() => setShowAddPartnerModal(true)}
          >
            + Register Partner
          </button>
        ) : null}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="table-responsive mb-5">
            <table
              style={{ cursor: "default" }}
              className="table table-bordered table-user"
            >
              <thead style={{ cursor: "default" }} className="heading_user">
                <tr style={{ cursor: "default" }}>
                  <th scope="col" style={{ width: "5%" }}>
                    Sr.
                  </th>
                  <th scope="col" style={{ width: "12%" }}>
                    Name
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Category
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Email
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Phone
                  </th>
                  <th scope="col" style={{ width: "5%" }}>
                    YOE
                  </th>
                  <th scope="col" style={{ width: "5%" }}>
                    Address
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Sign-Up
                  </th>
                  <th scope="col" style={{ width: "5%" }}>
                    Verify
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Status
                  </th>
                  <th scope="col" style={{ width: "5%" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody style={{ cursor: "default" }}>
                {restaurants.length === 0 ? (
                  <tr>
                    <td
                      colSpan="11"
                      style={{
                        textAlign: "center",
                      }}
                    >
                      No data available
                    </td>
                  </tr>
                ) : (
                  currentEntries.map((restaurant, index) => (
                    <tr style={{ cursor: "default" }} key={restaurant.id}>
                      <th scope="row" className="id-user">
                        {indexOfFirstEntry + index + 1}.
                      </th>
                      <td className="text-user">{restaurant.name}</td>
                      <td className="text-user">
                        {restaurant.category_id === 1
                          ? "Cook"
                          : restaurant.category_id === 2
                          ? "Driver"
                          : restaurant.category_id === 3
                          ? "Gardener"
                          : "Unknown"}
                      </td>
                      <td className="text-user">
                        {restaurant.email ? (
                          restaurant.email
                        ) : (
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            -
                          </span>
                        )}
                      </td>
                      <td className="text-user">{restaurant.mobile}</td>
                      <td className="text-user">
                        {restaurant.years_of_experience}
                      </td>
                      <td className="text-user">
                        {restaurant.current_address}
                      </td>
                      <td className="text-user">
                        {new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        })
                          .format(new Date(restaurant.created_at))
                          .replace(",", "")}
                      </td>
                      <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "2px",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          className={`edit_users ${
                            restaurant.is_verify !== 0 ? "disabled" : ""
                          }`}
                          onClick={
                            restaurant.is_verify === 0
                              ? () => handleVerifyClick(restaurant)
                              : null
                          }
                          style={{
                            cursor:
                              restaurant.is_verify === 0
                                ? "pointer"
                                : "not-allowed",
                            opacity: restaurant.is_verify === 0 ? 1 : 0.6,
                          }}
                        >
                          {restaurant.is_verify !== 0 ? (
                            <VerifiedUserIcon style={{ color: "green" }} />
                          ) : (
                            <>
                              <div>
                                <button
                                  style={{
                                    backgroundColor: "white",
                                    margin: 0,
                                    padding: 0,
                                  }}
                                  key={restaurant?.category_id}
                                  onClick={() =>
                                    handleNavigateToVerifyCook(
                                      restaurant?.category_id,
                                      restaurant?.id,
                                      restaurant?.is_verify
                                    )
                                  }
                                >
                                  <HighlightOffIcon style={{ color: "red" }} />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                      <td className={`status ${restaurant.active_status}`}>
                        <div
                          className={`status-background-${restaurant.active_status}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>
                            {restaurant.active_status === "active"
                              ? "Active"
                              : "InActive"}
                          </span>
                          <div
                            onClick={() => handleRestaurantClick(restaurant)}
                            style={{ cursor: "pointer", opacity: 1 }}
                          >
                            <EditIcon />
                          </div>
                        </div>
                      </td>
                      <td
                        className="edit_users action-btn-trash"
                        style={{ cursor: "pointer", opacity: 1 }}
                        onClick={() => handleDeleteClick(restaurant)}
                      >
                        <DeleteIcon style={{ color: "red" }} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <nav
            aria-label="Page navigation"
            className="d-flex justify-content-center"
          >
            {renderPaginationItems()}
          </nav>
        </>
      )}

      {showDetailsModal && (
        <EditRestroModal
          show={showDetailsModal}
          handleClose={handleCloseDetailsModal}
          restaurantDetails={selectedRestaurant}
          getRestaurantTableData={getRestaurantTableData}
        />
      )}

      {ShowVerifyModal && (
        <VerifyModal
          show={ShowVerifyModal}
          handleClose={handleCloseVerifyModal}
          restaurantDetails={selectedRestaurant}
          getRestaurantTableData={getRestaurantTableData}
        />
      )}
      {selectedId && <VerifyChef restaurant={selectedId} />}
      <DeletePartnerModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleDelete={handleDeletePartner}
        partner={partnerToDelete || {}}
      />
      <AddPartnerModal
        show={showAddPartnerModal}
        handleClose={() => setShowAddPartnerModal(false)}
        getRestaurantTableData={getRestaurantTableData}
      />
    </div>
  );
};

export default VerifiedPartnerTab;
