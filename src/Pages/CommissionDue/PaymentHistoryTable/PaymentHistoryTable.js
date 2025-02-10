import React, { useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import axios from "axios";
import { toast } from "react-toastify";
import "../CommissionDueTabs/CommonCommissionTab/CommonCommissionTab.css";

const PaymentHistoryTable = ({
  loading,
  setLoading,
}) => {
  const [dummy_Data, setDummy_Data] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // Search input state
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const entriesPerPage = 5; // Set number of entries per page

  const getCommissionData = async () => {
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

      setLoading(true);

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
      } else {
        toast.error(response.data.message || "Failed to fetch payment history.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
      toast.error("Failed to load payment history. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getCommissionData();
  }, []);

  // Filter data based on search input
  const normalizeString = (str) => str?.replace(/\s+/g, ' ').trim().toLowerCase() || '';

  const filteredData = dummy_Data.filter(
    (item) =>
      normalizeString(item.partner_name).includes(normalizeString(searchInput)) ||
      normalizeString(item.category_name).includes(normalizeString(searchInput))
  );
  

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

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
          placeholder="Search by partner name or category..."
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
                <th scope="col" style={{ width: "20%" }}>
                  Partner Name
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Category
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Created At
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Payout Amount
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Transaction ID
                </th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No data available
                  </td>
                </tr>
              ) : (
                currentEntries.map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row">{index + 1 + (currentPage - 1) * entriesPerPage}.</th>
                    <td>{item.partner_name || "Unknown"}</td>
                    <td>{item.category_name || "N/A"}</td>
                    <td>{new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" }).format(new Date(item.created_at)) || "N/A"}</td>

                    <td>{item.payout_amount || "N/A"}</td>
                    <td>{item.payment_transaction_id || "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <nav className="d-flex justify-content-center">
        {renderPaginationItems()}
      </nav>
    </div>
  );
};

export default PaymentHistoryTable;
