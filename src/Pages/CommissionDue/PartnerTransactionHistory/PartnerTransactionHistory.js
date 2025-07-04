import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";
import "../CommissionDueTabs/CommonCommissionTab/CommonCommissionTab.css";

const PartnerTransactionHistory = ({ loading, setLoading }) => {
  const [dummy_Data, setDummy_Data] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // Search input state
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const entriesPerPage = 10; // Set number of entries per page

  const getCommissionData = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/partner_transactions`,
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
        toast.error(
          response.data.message || "Failed to fetch payment history."
        );
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput]);
  
  const exportToCSV = () => {
    if (dummy_Data.length === 0) {
      toast.error("No data available to export.");
      return;
    }
  
    const headers = [
      "Sr No.",
      "Partner Name",
      "Category",
      "Created At",
      "Payout Amount",
      "Transaction ID",
    ];
  
    const csvRows = [];
    csvRows.push(headers.join(",")); // Add headers to CSV
  
    dummy_Data.forEach((item, index) => {
      // Convert "created_at" (ISO 8601 format) to "DD/MM/YY"
      const dateObj = new Date(item.transaction_date);
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = String(dateObj.getFullYear()).slice(-2); // Get last 2 digits of the year
      const formattedDate = `${day}/${month}/${year}`;
  
      const row = [
        index + 1,
        item?.partner?.name || "Unknown",
        item.category?.category_name || "N/A",
        `"${formattedDate}"`, // Ensure date is treated as a string
        item.payout_amount || "N/A",
        item.razorpay_payment_id || "N/A",
      ];
      csvRows.push(row.join(",")); // Convert row array to CSV string
    });
  
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "PaymentHistory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Filter data based on search input
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Two-digit day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Two-digit month
    const year = String(date.getFullYear()).slice(-2); // Last two digits of the year
    return `${day}/${month}/${year}`; // DD/MM/YY format
  };
  
  const normalizeString = (str) =>
    str?.toString().replace(/\s+/g, " ").trim().toLowerCase() || "";
  
  const filteredData = dummy_Data.filter((item) => {
    const searchTerm = normalizeString(searchInput);
  
    // Convert the relevant numeric fields to string for comparison
    const formattedDate = normalizeString(formatDate(item.transaction_date)); // Convert date to DD/MM/YY and normalize
    const tdsAmount = normalizeString(item.tds_amount?.toString()); // Ensure it's a string
    const payoutAmountAfterTds = normalizeString(item.payout_amount_after_tds?.toString()); // Ensure it's a string
    const normalizedUid = normalizeString(item.partner.uid || ""); // Normalize uid field
  
    return (
      normalizedUid.includes(searchTerm) || // Check if uid matches the search term
      normalizeString(item.partner.name).includes(searchTerm) ||
      normalizeString(item.category?.category_name).includes(searchTerm) ||
      normalizeString(item.payout_amount).includes(searchTerm) ||
      normalizeString(item.razorpay_payment_id).includes(searchTerm) ||
      formattedDate.includes(searchTerm) || // Ensure search works with formatted date
      tdsAmount.includes(searchTerm) || // Allow search on tds_amount
      payoutAmountAfterTds.includes(searchTerm) // Allow search on payout_amount_after_tds
    );
  });
  
   
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
      <div className="mb-3"style={{display: "flex",flexDirection: "row-reverse",justifyContent: "space-between",alignItems: "center",}}>
      <button className="Discount-btn mb-0" onClick={exportToCSV}>
          Export To CSV
        </button>
      <div className="search-bar " style={{ width: "800px" }}>
        <input
          type="text"
          className="form-control search-input w-25"
          placeholder="Search by partner name or category..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
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
                  Transaction Date
                </th>
                {/* <th scope="col" style={{ width: "15%" }}>
                  TDS Amount
                </th> */}
                <th scope="col" style={{ width: "15%" }}>
                 Dues
                </th>
                {/* <th scope="col" style={{ width: "15%" }}>
                Payout Amount After TDS
                </th> */}
                <th scope="col" style={{ width: "15%" }}>
                  RazerPay Payment ID
                </th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No data available
                  </td>
                </tr>
              ) : (
                currentEntries.map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row">
                      {index + 1 + (currentPage - 1) * entriesPerPage}.
                    </th>
                    <td>{item?.partner.uid || "Unknown"}</td>
                    <td>{item?.partner.name || "Unknown"}</td>
                    <td>{item?.category?.category_name || "N/A"}</td>
                    <td>
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      }).format(new Date(item.transaction_date)) || "N/A"}
                    </td>

                    {/* <td>{item.tds_amount || "N/A"}</td> */}
                    <td>{item.payout_amount || "N/A"}</td>
                    {/* <td>{item.payout_amount_after_tds || "N/A"}</td> */}
                    <td>{item.razorpay_payment_id || "N/A"}</td>
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

export default PartnerTransactionHistory;
