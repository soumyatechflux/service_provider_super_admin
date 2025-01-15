import React, { useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import axios from "axios";
import { toast } from "react-toastify";
import "../CommissionDueTabs/CommonCommissionTab/CommonCommissionTab.css";

const PaymentHistoryTable = ({
  loading,
  setLoading,
}) => {
  // Sample data constant
  const [dummy_Data, setDummy_Data] = useState([]);

  const getCommissionData = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );

      setLoading(true);

      // Make the API call without category_id
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/payment_history`,
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

        console.log("Payment history data:", data);
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
    getCommissionData();
  }, []);

  return (
    <div className="SubCategory-Table-Main p-3">
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
                  Payout Amount
                </th>
                {/* <th scope="col" style={{ width: "20%" }}>
                  Address
                </th> */}
              </tr>
            </thead>
            <tbody>
              {dummy_Data.map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}.</th>
                  <td>{item.partner_name || "Unknown"}</td>
                  <td>{item.category_name || "N/A"}</td>
                  <td>{item.payout_amount || "N/A"}</td> {/* Updated here */}
                  {/* <td>
                    {item.current_address || "No current_address available."}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryTable;
