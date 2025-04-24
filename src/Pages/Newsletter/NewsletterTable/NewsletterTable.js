import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";

const NewsletterTable = () => {
  const [newsletterData, setNewsletterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  
  const entriesPerPage = 10;
  const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

  const getNewsletterData = useCallback(async () => {
    try {
      if (!token) {
        console.error("No token found, authorization failed.");
        return;
      }
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/subscribers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      if (response?.status === 200 && response?.data?.success) {
        setNewsletterData(response?.data?.data || []);
      } else {
        toast.error(response?.data?.message || "Failed to fetch newsletters.");
      }
    } catch (error) {
      console.error("Error fetching newsletters:", error);
      toast.error("Failed to load newsletters. Please try again.");
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getNewsletterData();
  }, [getNewsletterData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput]);
  
  const filteredData = newsletterData.filter((item) => {
    const formattedDate = new Date(item.created_at).toLocaleDateString("en-GB"); 
    return (
      item.email.toLowerCase().includes(searchInput.toLowerCase()) ||
      formattedDate.includes(searchInput) 
    );
  });
  

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <div className="Newsletter-Table-Main p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Newsletter Subscribers</h2>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by email..."
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
                  <th>Email</th>
                  <th>Subscribe Date</th>

                </tr>
              </thead>
              <tbody>
                {currentEntries.length > 0 ? (
                  currentEntries.map((item, index) => (
                    <tr key={index}>
                      <td>{indexOfFirstEntry + index + 1}</td>
                      <td>{item.email}</td>
                      <td>{new Date(item.created_at).toLocaleDateString("en-GB")}</td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No newsletter subscribers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <nav className="d-flex justify-content-center">
  <ul className="pagination mb-0">
    {/* First & Previous */}
    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
      <button className="page-link" onClick={() => setCurrentPage(1)}>First</button>
    </li>
    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
      <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
    </li>

    {/* Page Numbers */}
    {(() => {
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages, startPage + 2);
      if (endPage === totalPages) startPage = Math.max(1, endPage - 2);

      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNum) => (
        <li key={pageNum} className={`page-item ${currentPage === pageNum ? "active" : ""}`}>
          <button className="page-link" onClick={() => setCurrentPage(pageNum)}>
            {pageNum}
          </button>
        </li>
      ));
    })()}

    {/* Next & Last */}
    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
      <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
    </li>
    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
      <button className="page-link" onClick={() => setCurrentPage(totalPages)}>Last</button>
    </li>
  </ul>
</nav>

        </>
      )}
    </div>
  );
};

export default NewsletterTable;