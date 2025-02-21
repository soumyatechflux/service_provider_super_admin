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
  const [expandedRows, setExpandedRows] = useState({}); // Track expanded rows
  const [selectedContact, setSelectedContact] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const entriesPerPage = 10;
  const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

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
        toast.error(response?.data?.message || "Failed to fetch contact messages.");
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
    str?.toString().replace(/\s+/g, " ").trim().toLowerCase() || "";

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${String(date.getFullYear()).slice(2)}`;
  };

  const filteredData = contactData.filter((item) => {
    const searchTerm = normalizeString(searchInput);
    return (
      normalizeString(item.name ?? "").includes(searchTerm) ||
      normalizeString(item.email ?? "").includes(searchTerm) ||
      normalizeString(item.mobile ?? "").includes(searchTerm) ||
      normalizeString(item.location ?? "").includes(searchTerm) ||
      normalizeString(item.message ?? "").includes(searchTerm) ||
      normalizeString(formatDate(item.created_at)).includes(searchTerm) ||
      normalizeString(formatDate(item.updated_at)).includes(searchTerm) ||
      normalizeString(item.status ?? "").includes(searchTerm)||
      normalizeString(item.priority ?? "").includes(searchTerm) ||  
      normalizeString(item.assign ?? "").includes(searchTerm)     
    );
  });

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

  const toggleExpand = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const truncateText = (text, wordLimit) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return { truncated: words.slice(0, wordLimit).join(" "), isTruncated: true };
    }
    return { truncated: text, isTruncated: false };
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
                  <th>Sr. No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Location</th>
                  <th>Created At</th>
                  <th>Message</th>
                  <th>Assign To</th>
                  <th>Priority</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.length > 0 ? (
                  currentEntries.map((item, index) => {
                    const { truncated, isTruncated } = truncateText(item.message, 10);
                    const isExpanded = expandedRows[index];

                    return (
                      <tr key={index}>
                        <td>{indexOfFirstEntry + index + 1}</td>
                        <td>{item.name || "No name available"}</td>
                        <td>{item.email}</td>
                        <td>{item.mobile}</td>
                        <td>{item.location || "Not provided"}</td>
                        <td>{formatDate(item.created_at)}</td>
                        <td>
                          {isExpanded ? item.message : truncated}
                          {isTruncated && (
                            <button
                              onClick={() => toggleExpand(index)}
                              className="btn btn-link p-0 ms-2"
                              style={{  boxShadow:"none", textDecoration:"none"}}
                            >
                              {isExpanded ? "View Less" : "View More"}
                            </button>
                          )}
                        </td>
                        <td>{item.assign || "Not Assign"}</td>
                        <td>{item.priority || "N/A"}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <span>{item.status ? item.status : "N/A"}</span>
                            <EditIcon
                              onClick={() => {
                                setSelectedContact(item);
                                setEditModalOpen(true);
                              }}
                              style={{ cursor: "pointer", marginLeft: "10px" }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No contact messages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <nav className="d-flex justify-content-center">
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(1)}>First</button>
              </li>
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
              </li>
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

      {editModalOpen && selectedContact && (
        <EditStatusContactUs
          contact={selectedContact}
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onStatusChange={(newStatus) => {
            setContactData((prevData) =>
              prevData.map((c) => (c.id === selectedContact.id ? { ...c, status: newStatus } : c))
            );
          }}
          fetchContactData={getContactData}
        />
      )}
    </div>
  );
};

export default ContactUsTable;
