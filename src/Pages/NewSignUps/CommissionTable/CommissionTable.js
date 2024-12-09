import React, { useState, useEffect } from "react";

import { IoMdCheckmark } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../Loader/Loader";
import EditRestroModal from "./EditRestroModal/EditRestroModal";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoneIcon from "@mui/icons-material/Done";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import BlockIcon from "@mui/icons-material/Block";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import VerifyModal from "./VerifyModal/VerifyModal";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import VerifyChef from "../../VerifyPartners/VerifyChef/VerifyChef";
// import VerifyChef from "../../VerifyPartners/VerifyChef/VerifyChef";

const CommissionTable = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [ShowVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const navigate = useNavigate();
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

  // Fetch data on component mount
  useEffect(() => {
    getRestaurantTableData();
  }, []);

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetailsModal(true);
  };
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedRestaurant(null);
  };

  const handleVerifyClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowVerifyModal(true);
  };

  const handleCloseVerifyModal = () => {
    setShowVerifyModal(false);
    setSelectedRestaurant(null);
  };
  
  const handleNavigateToVerifyCook = (restaurant,id,isVerify) => {
    setSelectedId(restaurant);
    navigate("/verify-partner", { state: { restaurant,id,isVerify } });
  };

  return (
    <div className="Restro-Table-Main p-3">
      {loading ? (
        <Loader />
      ) : (
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
                <th scope="col" style={{ width: "15%" }}>
                  Name
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Email
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Phone
                </th>
                <th scope="col" style={{ width: "5%" }}>
                  YOE
                </th>
                <th scope="col" style={{ width: "13%" }}>
                  Address
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Sign-Up
                </th>
                <th scope="col" style={{ width: "5%" }}>
                  Verification
                </th>
                <th scope="col" style={{ width: "12%" }}>
                  Status
                </th>
                <th scope="col" style={{ width: "5%" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody style={{ cursor: "default" }}>
              {restaurants.map((restaurant, index) => (
                <tr style={{ cursor: "default" }} key={restaurant.id}>
                  <th scope="row" className="id-user">
                    {index + 1}.
                  </th>
                  <td className="text-user">{restaurant.name}</td>

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

                  {/* <td className={`status ${restaurant.is_verify}`}>
                    <div className={`status-background-${restaurant.is_verify}`}>
                      {restaurant.is_verify === 0
                        ? "No"
                        : "Yes"}
                    </div>
                  </td> */}

                  <td>
                    <div style={{ display: "flex", gap: "2px" }}>
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
                          : "In-Active"}
                      </span>
                      <div
                        onClick={() => handleRestaurantClick(restaurant)}
                        style={{
                          cursor: "pointer",
                          opacity: 1,
                        }}
                      >
                        <EditIcon />
                      </div>
                    </div>
                  </td>

                  <td
                    className="edit_users disabled"
                    style={{
                      cursor: "not-allowed",
                      opacity: 0.6,
                    }}
                  >
                    <DeleteIcon style={{ color: "gray" }} />
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
    </div>
  );
};

export default CommissionTable;
