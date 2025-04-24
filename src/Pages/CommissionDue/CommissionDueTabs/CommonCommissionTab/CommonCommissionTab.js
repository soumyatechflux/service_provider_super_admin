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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput]);
  
  const normalizeString = (str) =>
    str?.toString().replace(/\s+/g, " ").trim().toLowerCase() || "";

  // Log the normalized search input to see what it looks like
  console.log("Normalized Search Input:", normalizeString(searchInput));

  const filteredData = dummy_Data.filter((item) => {
    const normalizedName = normalizeString(item.name || "");
    const normalizedCategoryName = normalizeString(item.category_name || "");
    const normalizedAmount = normalizeString(String(item.total_partner_amount) || "");
    const normalizedUid = normalizeString(item.uid || "");

    // Log the normalized values of the current item to see what they look like
    console.log("Normalized UID:", normalizedUid);
    console.log("Normalized Name:", normalizedName);
    console.log("Normalized Category Name:", normalizedCategoryName);
    console.log("Normalized Amount:", normalizedAmount);

    return (
      normalizedName.includes(normalizeString(searchInput)) ||
      normalizedCategoryName.includes(normalizeString(searchInput)) ||
      normalizedAmount.includes(normalizeString(searchInput)) ||
      normalizedUid.includes(normalizeString(searchInput)) // Check UID too
    );
  });

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <div className="SubCategory-Table-Main p-3">
      <div className="d-flex justify-content-end align-items-center mb-3">
        <input
          type="text"
          className="form-control search-input w-25"
          placeholder="Search by name, category, amount, or UID..."
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
              {currentEntries.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No data available</td>
                </tr>
              ) : (
                currentEntries.map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row">
                      {index + 1 + (currentPage - 1) * entriesPerPage}.
                    </th>
                    <td>{item.uid || "Unknown"}</td>
                    <td>{item.name || "Unknown"}</td>
                    <td>{item.category_name || "N/A"}</td>
                    <td
                      style={{
                        color: item.total_partner_amount < 0 ? "red" : "inherit",
                      }}
                    >
                      {item.total_partner_amount || "N/A"}
                    </td>
                    <td
                      style={{
                        color: item.total_partner_amount_after_tds < 0 ? "red" : "inherit",
                      }}
                    >
                      {item.total_partner_amount_after_tds || "N/A"}
                    </td>
                    <td>
                      <button
                        className="payNow-btn"
                        onClick={() => handlePayNowClick(item)}
                        disabled={
                          item.total_partner_amount < 0 || item.total_partner_amount_after_tds < 0
                        }
                        style={{
                          backgroundColor:
                            item.total_partner_amount < 0 || item.total_partner_amount_after_tds < 0
                              ? "#ccc"
                              : "#007bff",
                          cursor:
                            item.total_partner_amount < 0 || item.total_partner_amount_after_tds < 0
                              ? "not-allowed"
                              : "pointer",
                          color: "#fff",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "5px",
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

      {/* Payment History Modal */}
      <PaymentHistoryModal
        open={showPaymentHistoryModal}
        handleClose={() => setShowPaymentHistoryModal(false)}
      />
    </div>
  );
};

export default CommonCommissionTab;
