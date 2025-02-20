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
  const [dummy_Data, setDummy_Data] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // Search input state
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const entriesPerPage = 10; // Set number of entries per page

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

  // Helper function to normalize strings for comparison
  const normalizeString = (str) =>
    str?.toString().replace(/\s+/g, " ").trim().toLowerCase() || "";

  // Updated filtering logic: search by name, category_name, or total_partner_amount
  const filteredData = dummy_Data.filter(
    (item) =>
      normalizeString(item.name).includes(normalizeString(searchInput)) ||
      normalizeString(item.category_name).includes(normalizeString(searchInput)) ||
      normalizeString(String(item.total_partner_amount)).includes(normalizeString(searchInput))
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(
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

  const renderPaginationItems = () => {
    const pageRange = getPageRange();

    return (
      <ul className="pagination mb-0" style={{ gap: "5px" }}>
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => setCurrentPage(1)}
            style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
          >
            First
          </button>
        </li>
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
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
            style={{
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
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
            style={{
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Last
          </button>
        </li>
      </ul>
    );
  };

  return (
    <div className="SubCategory-Table-Main p-3">
      {/* Search Input */}
      <div className="d-flex justify-content-end align-items-center mb-3">
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
                <th scope="col" style={{ width: "5%" }}>
                  Sr.
                </th>
                <th scope="col" style={{ width: "5%" }}>
                  Partner Id
                </th>
                <th scope="col" style={{ width: "20%" }}>
                  Partner Name
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Category
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Amount Due Before TDS
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Amount Due After TDS
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.filter((item) => item.total_partner_amount > 0)
                .length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No data available
                  </td>
                </tr>
              ) : (
                currentEntries
                  .filter((item) => item.total_partner_amount > 0) // Exclude rows with amount_due <= 0
                  .map((item, index) => (
                    <tr key={item.id}>
                      <th scope="row">
                        {index + 1 + (currentPage - 1) * entriesPerPage}.
                      </th>
                      <td>{item.partner_id || "Unknown"}</td>
                      <td>{item.name || "Unknown"}</td>
                      <td>{item.category_name || "N/A"}</td>
                      <td>{item.total_partner_amount || "N/A"}</td>
                      <td>{item.total_partner_amount_after_tds || "N/A"}</td>
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

      {/* Pagination */}
      {filteredData.length > 0 && (
        <nav className="d-flex justify-content-center">
          {renderPaginationItems()}
        </nav>
      )}
    </div>
  );
};

export default CommonCommissionTab;
