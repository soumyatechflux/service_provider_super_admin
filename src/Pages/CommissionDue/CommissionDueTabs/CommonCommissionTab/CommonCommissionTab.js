import React, { useEffect, useState } from "react";
import Loader from "../../../Loader/Loader";
import "./CommonCommissionTab.css";
import TransactionModal from "../TransactionModal/TransactionModal";
import axios from "axios";
import { toast } from "react-toastify";

const CommonCommissionTab = ({
  category_id,
  loading,
  setLoading,
  selectedItem,
  setSelectedItem,
  showModal,
  setShowModa,
  handlePayNowClick,
  handleCloseModal,
}) => {
  // Sample data constant
  const [dummy_Data, setDummy_Data] = useState([]);

  const getCommissionData = async (category_id) => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );

      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/payout/` +
          category_id,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      if (response?.status === 200 && response?.data?.success) {
        const data = response?.data?.data || [];

        setDummy_Data(data);

        console.log("dasd", data);
      } else {
        toast.error(response.data.message || "Failed to fetch commission.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching commission:", error);
      toast.error("Failed to load commission. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getCommissionData(category_id);
  }, [category_id]);

  return (
    <div className="SubCategory-Table-Main p-3">
        {/* <h2>Commission Due</h2> */}
      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive mb-5">
          <table className="table table-bordered table-user">
            <thead className="heading_user">
              <tr>
                <th scope="col" style={{ width: "5%" }}>
                  Sr.
                </th>
                <th scope="col" style={{ width: "20%" }}>
                  Partner Name
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Category
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Amount Due
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {dummy_Data.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No data available
                  </td>
                </tr>
              ) : (
                dummy_Data.map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row">{index + 1}.</th>
                    <td>{item.name || "Unknown"}</td>
                    <td>{item.category_name || "N/A"}</td>
                    <td>{item.total_partner_amount || "N/A"}</td>
                    <td className="action-btn-pay">
                      <button
                        className="payNow-btn"
                        onClick={() => handlePayNowClick(item)}
                      >
                        Pay Now
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Transaction Modal */}
      {showModal && (
        <TransactionModal
          item={selectedItem}
          onClose={handleCloseModal}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};

export default CommonCommissionTab;
