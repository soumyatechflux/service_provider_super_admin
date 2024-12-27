import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../Loader/Loader";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditCustomerModal from "../EditCustomersModal/EditCustomersModal";

const CustomersTable = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

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
                <th scope="col" style={{ width: "10%" }}>
                  Status
                </th>
                {/* <th scope="col" style={{ width: "5%" }}>
                  Action
                </th> */}
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

                  {/* <td
                    className="edit_users disabled action-btn-trash"
                    style={{
                      cursor: "not-allowed",
                      opacity: 0.6,
                    }}
                  >
                    <DeleteIcon style={{ color: "gray" }} />
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
