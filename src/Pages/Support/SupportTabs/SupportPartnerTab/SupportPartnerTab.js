import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../../Loader/Loader";
import EditStatusPartnerModal from "./EditStatusPartnerModal/EditStatusPartnerModal";

const SupportPartnerTab = () => {
  const [supportData, setSupportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSupport, setSelectedSupport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const entriesPerPage = 10;

  // Fetch support data
  const getSupportData = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );

      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/help_center_partner`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      if (response?.status === 200 && response?.data?.success) {
        const data = response?.data?.data || [];
        setSupportData(data);
      } else {
        toast.error(
          response.data?.message || "Failed to fetch support tickets."
        );
      }
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      toast.error("Failed to load support tickets. Please try again.");
      setLoading(false);
    }
  };

  const handleEditStatus = (support) => {
    setSelectedSupport(support);
    setShowModal(true);
  };

  const handleStatusChange = () => {
    getSupportData();
  };

  useEffect(() => {
    getSupportData();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  // Helper function to normalize strings for comparison
  const normalizeString = (str) => {
    if (!str) return "";
    return str.replace(/\s+/g, " ").trim().toLowerCase();
  };

  // Updated filtering logic: search by name, email, mobile, description, created_at, or updated_at
  const filteredData = supportData.filter((item) => {
    const searchTerm = normalizeString(searchInput);

    // Function to format date as "DD MMM YYYY"
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return `${date.getDate()} ${date.toLocaleString("en-US", {
        month: "short",
      })} ${date.getFullYear()}`;
    };

    return (
      normalizeString(item?.name ?? "").includes(searchTerm) ||
      normalizeString(item?.email ?? "").includes(searchTerm) ||
      normalizeString(item?.mobile ?? "").includes(searchTerm) ||
      normalizeString(item?.description ?? "").includes(searchTerm) ||
      normalizeString(formatDate(item?.created_at)).includes(searchTerm) || 
      normalizeString(formatDate(item?.updated_at)).includes(searchTerm) || 
      normalizeString(item?.status ?? "").includes(searchTerm) ||
      normalizeString(item?.priority ?? "").includes(searchTerm) || 
      normalizeString(item?.assign ?? "Unassigned").includes(searchTerm) 
    );
  });

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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(dateString));
    } catch (error) {
      return "Invalid Date";
    }
  };

  const renderPaginationItems = () => {
    const pageRange = getPageRange();

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
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
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
              onClick={() => handlePageChange(number)}
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
              handlePageChange(Math.min(currentPage + 1, totalPages))
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
            onClick={() => handlePageChange(totalPages)}
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
    <div className="Support-Table-Main p-3">
      <div className="d-flex justify-content-end align-items-center mb-3">
        <input
          type="text"
          className="form-control search-input w-25"
          placeholder="Search by name, email, mobile, description, or date..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="table-responsive mb-5">
            <table
              style={{ cursor: "default" }}
              className="table table-bordered table-user"
            >
              <thead className="heading_user">
                <tr>
                  <th style={{ width: "5%" }}>Sr. No.</th>
                  <th style={{ width: "10%" }}>Name</th>
                  <th style={{ width: "10%" }}>Mobile</th>
                  {/* <th style={{ width: "10%" }}>Email</th> */}
                  <th style={{ width: "25%" }}>Description</th>
                  <th style={{ width: "25%" }}>Image</th>
                  <th style={{ width: "10%" }}>Created At</th>
                  <th style={{ width: "10%" }}>Assign To</th>
                  <th style={{ width: "10%" }}>Priority</th>
                  <th style={{ width: "10%" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.length > 0 ? (
                  currentEntries.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{index + 1 + (currentPage - 1) * entriesPerPage}</td>
                      <td>{item?.name || "N/A"}</td>
                      <td>{item?.mobile || "N/A"}</td>
                      {/* <td>{item?.email || "N/A"}</td> */}
                      <td>{item?.description || "N/A"}</td>
                      <td>
                        {item.attachment ? (
                          <a
                            href={item.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={item.attachment}
                              alt="Partner"
                              style={{
                                width: "50px",
                                height: "50px",
                                cursor: "pointer",
                              }}
                            />
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>{formatDate(item?.created_at)}</td>
                      <td>{item?.assign || "N/A"}</td>
                      <td>{item?.priority || "N/A"}</td>
                      <td>
                        <div className="status-div">
                          <span>
                            {item.status
                              ? item.status.charAt(0).toUpperCase() +
                                item.status.slice(1)
                              : "New"}
                          </span>
                          <EditIcon
                            onClick={() => handleEditStatus(item)}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      style={{ textAlign: "center", padding: "10px" }}
                    >
                      No Data Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <nav className="d-flex justify-content-center">
              {renderPaginationItems()}
            </nav>
          )}
        </>
      )}
      {showModal && (
        <EditStatusPartnerModal
          support={selectedSupport}
          onClose={() => setShowModal(false)}
          onStatusChange={handleStatusChange}
          getSupportData={getSupportData}
        />
      )}
    </div>
  );
};

export default SupportPartnerTab;
