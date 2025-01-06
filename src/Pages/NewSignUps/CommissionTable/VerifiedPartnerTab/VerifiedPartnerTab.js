import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../../Loader/Loader";
import EditRestroModal from "../EditRestroModal/EditRestroModal";
import EditIcon from "@mui/icons-material/Edit";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import VerifyModal from "../VerifyModal/VerifyModal";
import DeleteIcon from "@mui/icons-material/Delete";
import VerifyChef from "../../../VerifyPartners/VerifyChef/VerifyChef";
import DeletePartnerModal from "../DeletePartnerModal/DeletePartnerModal";
import AddPartnerModal from "../AddPartner/AddPartnerModal"; // Import AddPartnerModal component

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

  const getRestaurantTableData = async () => {
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

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
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

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

  // Fetch data on component mount
  useEffect(() => {
    getRestaurantTableData();
  }, []);

  return (
    <div className="Restro-Table-Main p-3">
      <div style={{ float: "right" }}>
        {restaurants.filter((restaurant) => restaurant.is_verify === 0).length > 0 && (
          <button className="Discount-btn" onClick={() => setShowAddPartnerModal(true)}>
            + Register Partner
          </button>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive mb-5">
          <table style={{ cursor: "default" }} className="table table-bordered table-user">
            <thead style={{ cursor: "default" }} className="heading_user">
              <tr style={{ cursor: "default" }}>
                <th scope="col" style={{ width: "5%" }}>Sr.</th>
                <th scope="col" style={{ width: "12%" }}>Name</th>
                <th scope="col" style={{ width: "10%" }}>Category</th>
                <th scope="col" style={{ width: "10%" }}>Email</th>
                <th scope="col" style={{ width: "10%" }}>Phone</th>
                <th scope="col" style={{ width: "5%" }}>YOE</th>
                <th scope="col" style={{ width: "5%" }}>Address</th>
                <th scope="col" style={{ width: "10%" }}>Sign-Up</th>
                <th scope="col" style={{ width: "5%" }}>Verify</th>
                <th scope="col" style={{ width: "10%" }}>Status</th>
                <th scope="col" style={{ width: "5%" }}>Action</th>
              </tr>
            </thead>
            <tbody style={{ cursor: "default" }}>
              {restaurants.map((restaurant, index) => (
                <tr style={{ cursor: "default" }} key={restaurant.id}>
                  <th scope="row" className="id-user">{index + 1}.</th>
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
                    {restaurant.email ? restaurant.email : <span style={{ color: "red", fontWeight: "bold" }}>-</span>}
                  </td>
                  <td className="text-user">{restaurant.mobile}</td>
                  <td className="text-user">{restaurant.years_of_experience}</td>
                  <td className="text-user">{restaurant.current_address}</td>
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
                                  handleNavigateToVerifyCook(restaurant?.category_id, restaurant?.id, restaurant?.is_verify)
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
                        {restaurant.active_status === "active" ? "Active" : "In-Active"}
                      </span>
                      <div onClick={() => handleRestaurantClick(restaurant)} style={{ cursor: "pointer", opacity: 1 }}>
                        <EditIcon />
                      </div>
                    </div>
                  </td>
                  <td className="edit_users action-btn-trash" style={{ cursor: "pointer", opacity: 1 }} onClick={() => handleDeleteClick(restaurant)}>
                    <DeleteIcon style={{ color: "red" }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
