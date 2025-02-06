import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";

const ContactUsTable = () => {
  const [contactData, setContactData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const entriesPerPage = 10;

  const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

  // Fetch Contact Messages
  const getContactData = useCallback(async () => {
    try {
      if (!token) {
        console.error("No token found, authorization failed.");
        return;
      }

      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/contactus`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);
      if (response?.status === 200 && response?.data?.success) {
        setContactData(response?.data?.data || []);
      } else {
        toast.error(
          response?.data?.message || "Failed to fetch contact messages."
        );
      }
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      toast.error("Failed to load contact messages. Please try again.");
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getContactData();
  }, [getContactData]);

  const normalizeString = (str) =>
    str?.replace(/\s+/g, " ").trim().toLowerCase() || "";

  const filteredData = contactData.filter(
    (item) =>
      normalizeString(item.email).includes(normalizeString(searchInput)) ||
      normalizeString(item.name).includes(normalizeString(searchInput))
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const renderPaginationItems = () => {
    const pageRange = [];
    const rangeSize = 3;

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (endPage - startPage < rangeSize - 1) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + rangeSize - 1);
      } else {
        startPage = Math.max(1, endPage - rangeSize + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageRange.push(i);
    }

    const handlePageChange = (page) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
      <ul className="pagination mb-0" style={{ gap: "5px" }}>
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(1)}>
            First
          </button>
        </li>

        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(currentPage - 1)}
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
              onClick={() => handlePageChange(number)}
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
            onClick={() => handlePageChange(currentPage + 1)}
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
            onClick={() => handlePageChange(totalPages)}
          >
            Last
          </button>
        </li>
      </ul>
    );
  };

  return (
    <div className="Contact-Table-Main p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Contact Messages</h2>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by email or name..."
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
                  <th style={{ width: "5%" }}>Sr. No.</th>
                  <th style={{ width: "25%" }}>Name</th>
                  <th style={{ width: "25%" }}>Email</th>
                  <th style={{ width: "25%" }}>Mobile</th>
                  <th style={{ width: "20%" }}>Location</th>
                  <th style={{ width: "20%" }}>Created At</th>
                  <th style={{ width: "25%" }}>Message</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.length > 0 ? (
                  currentEntries.map((item, index) => (
                    <tr key={index}>
                      <td>{indexOfFirstEntry + index + 1}</td>
                      <td>{item.name || "No name available"}</td>
                      <td>{item.email}</td>
                      <td>{item.mobile}</td>
                      <td>{item.location || "Not provided"}</td>
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                      <td>{item.message}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No contact messages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <nav className="d-flex justify-content-center">
            {renderPaginationItems()}
          </nav>
        </>
      )}
    </div>
  );
};

export default ContactUsTable;
