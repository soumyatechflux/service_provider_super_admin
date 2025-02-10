import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import EditStatusContactUs from "./EditStatusContactUs/EditStatusContactUs";

const ContactUsTable = () => {
  const [contactData, setContactData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  // States for modal handling
  const [selectedContact, setSelectedContact] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

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

  // Helper function to normalize strings for comparison
  const normalizeString = (str) =>
    str?.toString().replace(/\s+/g, " ").trim().toLowerCase() || "";

  // Filtering logic: search by various fields
  const filteredData = contactData.filter((item) => {
    const searchTerm = normalizeString(searchInput);
  
    // Function to format date as "MM/DD/YYYY"
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two digits
      const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    };
  
    return (
      normalizeString(item.name ?? "").includes(searchTerm) ||
      normalizeString(item.email ?? "").includes(searchTerm) ||
      normalizeString(item.mobile ?? "").includes(searchTerm) ||
      normalizeString(item.location ?? "").includes(searchTerm) ||
      normalizeString(item.message ?? "").includes(searchTerm) ||
      normalizeString(formatDate(item.created_at)).includes(searchTerm) || // Formatted date search
      normalizeString(formatDate(item.updated_at)).includes(searchTerm) || // Formatted date search
      normalizeString(item.status ?? "").includes(searchTerm)
    );
  });
  

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

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
          <button
            className="page-link"
            onClick={() => handlePageChange(1)}
            style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
          >
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
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </li>
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
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
          placeholder="Search by name, email, mobile, location, message, or date..."
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
                  <th style={{ width: "20%" }}>Action</th>
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
                      <td>
                        {new Date(item.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </td>
                      <td>{item.message}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span>
                            {item.status ? item.status : "N/A"}
                          </span>
                          <EditIcon
                            onClick={() => {
                              setSelectedContact(item);
                              setEditModalOpen(true);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
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

      {/* Render the EditStatusContactUs modal */}
      {editModalOpen && selectedContact && (
        <EditStatusContactUs
          contact={selectedContact}
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onStatusChange={(newStatus) => {
            // Update the local state with the new status so that the table reflects the change immediately
            setContactData((prevData) =>
              prevData.map((c) =>
                c.id === selectedContact.id ? { ...c, status: newStatus } : c
              )
            );
          }}
          fetchContactData={getContactData}
        />
      )}
    </div>
  );
};

export default ContactUsTable;
