import React, { useState, useEffect } from "react";
import Loader from "../../Loader/Loader";

const PartnerReferalTable = () => {
  const [referralData, setReferralData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const entriesPerPage = 10;

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
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/partner-referrals`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch partner referrals.");
      }
      const data = await response.json();
      setReferralData(data.data || []);
    } catch (error) {
      console.error("Error fetching partner referral data:", error);
      setReferralData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, []);

  const normalizeString = (str) =>
    str?.toString().replace(/\s+/g, " ").trim().toLowerCase() || "";

  const filteredData = referralData.filter((item) => {
    const searchTerm = normalizeString(searchInput);
    return (
      normalizeString(item.referrer).includes(searchTerm) ||
      normalizeString(item.referredTo).includes(searchTerm) ||
      normalizeString(item.points).includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <div className="Referral-Table-Main p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by referrer, referred to, or points..."
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
                  <th>Referrer</th>
                  <th>Referred To</th>
                  <th>Referral Points</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.length > 0 ? (
                  currentEntries.map((item, index) => (
                    <tr key={index}>
                      <td>{indexOfFirstEntry + index + 1}</td>
                      <td>{item.referrer}</td>
                      <td>{item.referredTo}</td>
                      <td>{item.points}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
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
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(1)}
                    style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
                  >
                    First
                  </button>
                </li>
                {[...Array(totalPages)].map((_, number) => (
                  <li
                    key={number}
                    className={`page-item ${currentPage === number + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(number + 1)}
                      style={{
                        backgroundColor: currentPage === number + 1 ? "#007bff" : "white",
                        color: currentPage === number + 1 ? "white" : "#007bff",
                      }}
                    >
                      {number + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(totalPages)}
                    style={{ cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
                  >
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

export default PartnerReferalTable;
