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
import AttachmentModalPartner from "../AttachmentModalPartner/AttachmentModalPartner";

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
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [attachmentsData, setAttachmentsData] = useState({});
  const categoryMap = {
    1: "Cook",
    2: "Driver",
    3: "Gardener",
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  };
  

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

  const handleOpenAttachmentModal = (partner) => {
    console.log("Opening Modal with Partner Data:", partner); // Debugging
    setAttachmentsData(partner); // Pass full partner object
    setShowAttachmentModal(true);
  };

  const handleCloseAttachmentModal = () => {
    setShowAttachmentModal(false);
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

  const normalizeString = (str) =>
    str ? str.toString().trim().toLowerCase() : "";
  
  const isNumber = !isNaN(searchInput) && searchInput.trim() !== "";
  const searchTerm = normalizeString(searchInput);
  
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const categoryName = categoryMap[restaurant.category_id] || "";
    const formattedDate = formatDate(restaurant.created_at);
    const termsConditionText = restaurant.terms_and_condition === 1 ? "accepted" : "not accepted";
    const genderText = normalizeString(restaurant.gender || "");
  
    if (isNumber) {
      return (
        restaurant.years_of_experience?.toString() === searchInput.trim() || 
        restaurant.mobile?.toString().includes(searchInput.trim()) 
      );
    } else if (searchTerm === "accepted") {
      return restaurant.terms_and_condition === 1; // ✅ Show only records where terms_and_condition is 1
    } else if (searchTerm === "not accepted") {
      return restaurant.terms_and_condition === 0; // ✅ Show only records where terms_and_condition is 0
    } else if (searchTerm === "male" || searchTerm === "female") {
      return genderText === searchTerm;
    } else {
      return (
        normalizeString(restaurant.name).includes(searchTerm) ||
        normalizeString(restaurant.email).includes(searchTerm) ||
        normalizeString(restaurant.rating?.toString()).includes(searchTerm) ||
        normalizeString(categoryName).includes(searchTerm) ||
        restaurant.mobile?.toString().includes(searchTerm) ||
        normalizeString(restaurant.current_address).includes(searchTerm) ||
        normalizeString(restaurant.state).includes(searchTerm) ||
        normalizeString(restaurant.registered_by_name).includes(searchTerm) ||
        normalizeString(restaurant.active_status).includes(searchTerm) ||
        normalizeString(formattedDate).includes(searchTerm) ||
        normalizeString(restaurant.uid).includes(searchTerm)

      );
    }
  });
  
  
  
  
  // Pagination logic
  const totalPages = Math.ceil(restaurants.length / entriesPerPage);
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

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [restaurants]);

  const renderPaginationItems = () => {
    // Don't render pagination if filtered data is less than or equal to entriesPerPage
    if (filteredRestaurants.length <= entriesPerPage) return null;

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
          {restaurants.filter((restaurant) => restaurant.is_verify === 0)
            .length > 0
            ? "Unverified Partners"
            : restaurants.filter((restaurant) => restaurant.is_verify === 1)
                .length > 0
            ? "Verified Partners"
            : "No Partners Available"}
        </h2>
        <input
          type="text"
          className="form-control search-input w-25"
          placeholder="Search partners..."
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
                  <th scope="col" style={{ width: "5%" }}>
                    Partner ID
                  </th>
                  <th scope="col" style={{ width: "12%" }}>
                    Name
                  </th>
                  <th scope="col" style={{ width: "12%" }}>
                    Gender
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Category
                  </th>
                  {/* <th scope="col" style={{ width: "10%" }}>
                    Email
                  </th> */}
                  <th scope="col" style={{ width: "10%" }}>
                    Phone
                  </th>
                  <th scope="col" style={{ width: "5%" }}>
                    YOE
                  </th>
                  <th scope="col" style={{ width: "5%" }}>
                    Address
                  </th>
                  <th scope="col" style={{ width: "5%" }}>
                    State
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Sign-Up
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Ratings
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    T & C 
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Register By
                  </th>
                  <th scope="col" style={{ width: "5%" }}>
                    Verification Action
                  </th>
                  {restaurants.some(
                    (restaurant) => restaurant.is_verify === 1
                  ) && (
                    <th scope="col" style={{ width: "10%" }}>
                      Status
                    </th>
                  )}
                  <th scope="col" style={{ width: "5%" }}>
                    Action
                  </th>

                  <th scope="col" style={{ width: "10%" }}>
                    View Details
                  </th>
                </tr>
              </thead>
              <tbody style={{ cursor: "default" }}>
  {currentEntries.length === 0 ? (
    <tr>
      <td colSpan="16" style={{ textAlign: "center", fontWeight: "bold" }}>
        No data available
      </td>
    </tr>
  ) : (
    currentEntries.map((restaurant, index) => (
      <tr style={{ cursor: "default" }} key={restaurant.id}>
        <th scope="row" className="id-user">
          {indexOfFirstEntry + index + 1}.
        </th>
        <td className="text-user">{restaurant.uid}</td>
        <td className="text-user">
          {restaurant.name
            ? restaurant.name.charAt(0).toUpperCase() + restaurant.name.slice(1)
            : "N/A"}
        </td>
        <td className="text-user">
          {restaurant.gender
            ? restaurant.gender.charAt(0).toUpperCase() + restaurant.gender.slice(1)
            : "N/A"}
        </td>
        <td className="text-user">
          {restaurant.category_id === 1
            ? "Cook"
            : restaurant.category_id === 2
            ? "Driver"
            : restaurant.category_id === 3
            ? "Gardener"
            : "Unknown"}
        </td>
        <td className="text-user">{restaurant.mobile}</td>
        <td className="text-user">{restaurant.years_of_experience || "N/A"}</td>
        <td className="text-user">
          {restaurant.current_address
            ? restaurant.current_address.charAt(0).toUpperCase() + restaurant.current_address.slice(1)
            : "N/A"}
        </td>
        <td className="text-user">{restaurant.state || "N/A"}</td>

        <td className="text-user">
          {new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          })
            .format(new Date(restaurant.created_at))
            .replace(",", "")}
        </td>
        <td className="text-user">
          <strong>{restaurant.rating}</strong>
        </td>
        <td className="text-user">
          {restaurant.terms_and_condition === 1 ? "Accepted" : "Not Accepted"}
        </td>
        <td className="text-user">
          {restaurant.registered_by_name || "N/A"}
        </td>
        {/* <td>
          <div style={{ display: "flex", gap: "2px", justifyContent: "center" }}>
            <div
              className={`edit_users ${restaurant.is_verify !== 0 ? "disabled" : ""}`}
              onClick={restaurant.is_verify === 0 ? () => handleVerifyClick(restaurant) : null}
              style={{
                cursor: restaurant.is_verify === 0 ? "pointer" : "not-allowed",
                opacity: restaurant.is_verify === 0 ? 1 : 0.6,
              }}
            >
              {restaurant.is_verify !== 0 ? (
                <VerifiedUserIcon style={{ color: "green" }} />
              ) : (
                <button
                  style={{
                    backgroundColor: "white",
                    margin: 0,
                    padding: 0,
                  }}
                  key={restaurant?.category_id}
                  onClick={() =>
                    handleNavigateToVerifyCook(restaurant?.category_id, restaurant?.id, restaurant?.is_verify)
                  }
                >
                  <HighlightOffIcon style={{ color: "red" }} />
                </button>
              )}
            </div>
          </div>
        </td> */}


<td>
  <div style={{ display: "flex", gap: "2px", justifyContent: "center" }}>
    <div
      className="edit_users"
      onClick={() =>
        handleNavigateToVerifyCook(restaurant?.category_id, restaurant?.id, restaurant?.is_verify)
      }
      style={{
        cursor: "pointer",
        opacity: 1,
      }}
    >
      {restaurant.is_verify !== 0 ? (
        // <VerifiedUserIcon style={{ color: "green" }} />
        <EditIcon style={{ color: "green" }} />
      ) : (
        <HighlightOffIcon style={{ color: "red" }} />
      )}
    </div>
  </div>
</td>



        {restaurant.is_verify === 1 && (
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
                {{
                  active: "Active",
                  inactive: "Inactive",
                  suspended: "Suspended",
                  blocked: "Blocked",
                }[restaurant.active_status] || "Unknown Status"}
              </span>
              <div  onClick={() => handleRestaurantClick(restaurant)} style={{ cursor: "pointer", opacity: 1 }}>
              <EditIcon />
              </div>
            </div>
          </td>
        )}
        <td >
          <DeleteIcon className="edit_users action-btn-trash" style={{ cursor: "pointer", opacity: 1, color: "red" }} onClick={() => handleDeleteClick(restaurant)} />
          {/* <EditIcon /> */}
        </td>
        <td className="text-user">
          <i
            className="fa fa-eye text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => handleOpenAttachmentModal(restaurant)}
          />
        </td>
      </tr>
    ))
  )}
</tbody>

            </table>
          </div>
          {totalPages > 1 && (
            <nav
              aria-label="Page navigation"
              className="d-flex justify-content-center"
            >
              {renderPaginationItems()}
            </nav>
          )}
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
      <AttachmentModalPartner
        open={showAttachmentModal}
        attachments={attachmentsData}
        onClose={handleCloseAttachmentModal}
      />
    </div>
  );
};

export default VerifiedPartnerTab;
