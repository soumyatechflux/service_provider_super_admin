import React, { useState, useEffect } from "react";
import "./CommissionTable.css";
import { IoMdCheckmark } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../Loader/Loader";
import EditRestroModal from "./EditRestroModal/EditRestroModal";
import EditIcon from "@mui/icons-material/Edit";

const CommissionTable = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

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
    Sr No.
  </th>
  <th scope="col" style={{ width: "15%" }}>
    Name
  </th>
  <th scope="col" style={{ width: "12%" }}>
    Email
  </th>
  <th scope="col" style={{ width: "10%" }}>
    Phone
  </th>
  <th scope="col" style={{ width: "10%" }}>
    Years of Exp.
  </th>
  <th scope="col" style={{ width: "15%" }}>
    Address
  </th>
  <th scope="col" style={{ width: "10%" }}>
    Signup Date
  </th>
  <th scope="col" style={{ width: "10%" }}>
    Verified
  </th>
  <th scope="col" style={{ width: "8%" }}>
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
                      <span style={{ color: "red", fontWeight: "bold" }}>-</span>
                    )}
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
                
                  <td className={`status ${restaurant.is_verify}`}>
                    <div className={`status-background-${restaurant.is_verify}`}>
                      {restaurant.is_verify === 0
                        ? "No"
                        : "Yes"}
                    </div>
                  </td>


                  <td className={`status ${restaurant.active_status}`}>
                    <div className={`status-background-${restaurant.active_status}`}>
                      {restaurant.active_status === "active"
                        ? "Active"
                        : "In-Active"}
                    </div>
                  </td>
                  <td
  className={`edit_users ${
    restaurant.active_status === "active" ? "disabled" : ""
  }`}
  onClick={
    restaurant.active_status !== "active"
      ? () => handleRestaurantClick(restaurant)
      : null
  }
  style={{
    cursor: restaurant.active_status === "active" ? "not-allowed" : "pointer",
    opacity: restaurant.active_status === "active" ? 0.6 : 1,
  }}
>
  <EditIcon />
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
    </div>
  );
};

export default CommissionTable;
