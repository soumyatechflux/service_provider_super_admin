import React, { useEffect, useState } from "react";
import Loader from "../../../Loader/Loader";
import "./CommonCommissionTab.css";
import TransactionModal from "../TransactionModal/TransactionModal";
import axios from "axios";
import { toast } from "react-toastify";
import PaymentHistoryModal from "../../PaymentHistoryModal/PaymentHistoryModal";

const CommonCommissionTab = ({
  category_id,
  loading,
  setLoading,
  selectedItem,
  setSelectedItem,
  showModal,
  setShowModal,
  handlePayNowClick,
  handleCloseModal,
}) => {
  const [dummy_Data, setDummy_Data] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const entriesPerPage = 10;

  const getCommissionData = async (category_id) => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );
      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/payout/${category_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      if (response?.status === 200 && response?.data?.success) {
        setDummy_Data(response?.data?.data || []);
      } else {
        toast.error(response.data.message || "Failed to fetch commission.");
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

  const normalizeString = (str) =>
    str?.toString().replace(/\s+/g, " ").trim().toLowerCase() || "";

  const filteredData = dummy_Data.filter(
    (item) =>
      normalizeString(item.name).includes(normalizeString(searchInput)) ||
      normalizeString(item.category_name).includes(normalizeString(searchInput)) ||
      normalizeString(String(item.total_partner_amount)).includes(normalizeString(searchInput))
  );

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <div className="SubCategory-Table-Main p-3">
      <div className="mb-3 d-flex justify-content-between align-items-center">
        {/* <button
          className="Discount-btn mb-0"
          onClick={() => setShowPaymentHistoryModal(true)}
        >
          View Payment History
        </button> */}
        <input
          type="text"
          className="form-control search-input w-25"
          placeholder="Search by name, category or amount..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive mb-5">
          <table className="table table-bordered table-user">
            <thead className="heading_user">
              <tr>
                <th>Sr.</th>
                <th>Partner Id</th>
                <th>Partner Name</th>
                <th>Category</th>
                <th>Payout Amount Due Before TDS</th>
                <th>Payout Amount Due After TDS</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.filter((item) => item.total_partner_amount > 0).length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No data available</td>
                </tr>
              ) : (
                currentEntries.map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row">{index + 1 + (currentPage - 1) * entriesPerPage}.</th>
                    <td>{item.uid|| "Unknown"}</td>
                    <td>{item.name || "Unknown"}</td>
                    <td>{item.category_name || "N/A"}</td>
                    <td style={{ color: item.total_partner_amount < 0 ? "red" : "inherit" }}>
  {item.total_partner_amount || "N/A"}
</td>
<td style={{ color: item.total_partner_amount_after_tds < 0 ? "red" : "inherit" }}>
  {item.total_partner_amount_after_tds || "N/A"}
</td>

<td>
  <button
    className="payNow-btn"
    onClick={() => handlePayNowClick(item)}
    disabled={item.total_partner_amount < 0 || item.total_partner_amount_after_tds < 0}
    style={{
      backgroundColor: item.total_partner_amount < 0 || item.total_partner_amount_after_tds < 0 ? "#ccc" : "#007bff",
      cursor: item.total_partner_amount < 0 || item.total_partner_amount_after_tds < 0 ? "not-allowed" : "pointer",
      color: "#fff",
      border: "none",
      padding: "5px 10px",
      borderRadius: "5px"
    }}
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

      {/* Payment History Modal - FIXED */}
      <PaymentHistoryModal
        open={showPaymentHistoryModal}
        handleClose={() => setShowPaymentHistoryModal(false)} 
      />
    </div>
  );
};

export default CommonCommissionTab;
