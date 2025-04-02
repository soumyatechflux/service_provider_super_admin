import React, { useState, useEffect } from "react";
import Loader from "../../Loader/Loader";

const CustomerReferralTable = () => {
  const [referralData, setReferralData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const entriesPerPage = 10;

  // Fetch referral data
  const fetchReferralData = async () => {
    setLoading(true);
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

    if (!token) {
      console.error("Token not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/customer_refer_points`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch referral data: ${response.statusText}`);
      }

      const data = await response.json();

      if (data?.success && Array.isArray(data.data)) {
        setReferralData(data.data);
      } else {
        console.error("Invalid API response structure.");
        setReferralData([]);
      }
    } catch (error) {
      console.error("Error fetching referral data:", error);
      setReferralData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, []);

  // Normalize string for case-insensitive search
  const normalizeString = (str) =>
    str?.toString().replace(/\s+/g, " ").trim().toLowerCase() || "";

  // Filtered data based on search input
  const filteredData = referralData.filter((item) => {
    const searchTerm = normalizeString(searchInput);
    return (
      normalizeString(item.name).includes(searchTerm) ||
      normalizeString(item.referred_to_name).includes(searchTerm) ||
      normalizeString(item.referral_code).includes(searchTerm) || 
      normalizeString(item.wallet_balance.toString()).includes(searchTerm) ||
      normalizeString(item.used_referral_code).includes(searchTerm) || 
      normalizeString(item.refer_by_name).includes(searchTerm) 
    );
  });
  

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <div className="Referral-Table-Main p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
      <h2>Customer Referral Table</h2>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by referrer, referred person, or points..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="table-responsive mb-5">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Name</th>
                  {/* <th>Referred To</th> */}
                  <th>Referral Code</th>
                  <th>Refer By</th>
                  <th>Used Referral Code</th>
                  <th>Referral Points</th>
                  {/* <th>Wallet Amount</th> */}

                </tr>
              </thead>
              <tbody>
                {currentEntries.length > 0 ? (
                  currentEntries.map((item, index) => (
                    <tr key={item.id}>
                      <td>{indexOfFirstEntry + index + 1}</td>
                      <td>{item.name || "N/A"}</td>
                      {/* <td>{item.referred_to_name  || "N/A"}</td> */}
                      <td>{item.referral_code  || "N/A"}</td>
                      <td>{item.refer_by_name || "N/A"}</td>
                      <td>{item.used_referral_code || "N/A"}</td>
                      <td>{item.wallet_balance  || "N/A"}</td>
                      {/* <td>{item.wallet_amount || "N/A"}</td> */}

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <nav className="d-flex justify-content-center">
              <ul className="pagination mb-0" style={{ gap: "5px" }}>
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(1)}>
                    First
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, currentPage - 3),
                    Math.min(totalPages, currentPage + 2)
                  )
                  .map((number) => (
                    <li
                      key={number}
                      className={`page-item ${currentPage === number ? "active" : ""}`}
                    >
                      <button className="page-link" onClick={() => setCurrentPage(number)}>
                        {number}
                      </button>
                    </li>
                  ))}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(totalPages)}>
                    Last
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerReferralTable;
