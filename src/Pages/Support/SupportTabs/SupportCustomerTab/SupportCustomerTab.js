import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Loader from "../../../Loader/Loader";
import { toast } from "react-toastify";
import EditStatusModal from "./../SupportCustomerTab/EditStatusModal/EditStatusModal";
import EditIcon from "@mui/icons-material/Edit";

const SupportCustomerTab = () => {
  const [supportData, setSupportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSupport, setSelectedSupport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const entriesPerPage = 10;

  // Fetch Support Data
  const getSupportData = useCallback(async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );
      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/supports/?user_role=customer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      if (response?.status === 200 && response?.data?.success) {
        setSupportData(response?.data?.data || []);
      } else {
        toast.error(
          response?.data?.message || "Failed to fetch support tickets."
        );
      }
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      toast.error("Failed to load support tickets. Please try again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getSupportData();
  }, [getSupportData]);

  const normalizeString = (str) => str?.replace(/\s+/g, ' ').trim().toLowerCase() || '';

  const filteredData = supportData.filter(
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

  const handleEditStatus = (support) => {
    setSelectedSupport(support);
    setShowModal(true);
  };

  const updateSupportStatus = (supportId, newStatus) => {
    setSupportData((prevData) =>
      prevData.map((item) =>
        item.support_id === supportId ? { ...item, status: newStatus } : item
      )
    );
  };

  const renderPaginationItems = () => {
    const pageRange = [];
    const rangeSize = 3;
  
    // Logic to display page range dynamically
    let startPage = Math.max(1, currentPage - 1); // Ensure it doesn't go below 1
    let endPage = Math.min(totalPages, currentPage + 1); // Ensure it doesn't go above totalPages
  
    // Adjust the range if needed to maintain the range size
    if (endPage - startPage < rangeSize - 1) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + rangeSize - 1);
      } else {
        startPage = Math.max(1, endPage - rangeSize + 1);
      }
    }
  
    // Build the page range array
    for (let i = startPage; i <= endPage; i++) {
      pageRange.push(i);
    }
  
    const handlePageChange = (page) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  
    return (
      <ul className="pagination mb-0" style={{ gap: "5px" }}>
        {/* First Page Button */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(1)}
            style={{
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            First
          </button>
        </li>
  
        {/* Previous Button */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(currentPage - 1)}
            style={{
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            Previous
          </button>
        </li>
  
        {/* Page Numbers */}
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
  
        {/* Next Button */}
        <li
          className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => handlePageChange(currentPage + 1)}
            style={{
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next
          </button>
        </li>
  
        {/* Last Page Button */}
        <li
          className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Customer Support</h2>
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
                  <th style={{ width: "10%" }}>Name</th>
                  <th style={{ width: "20%" }}>Email</th>
                  <th style={{ width: "10%" }}>Role</th>
                  <th style={{ width: "25%" }}>Description</th>
                  <th style={{ width: "10%" }}>Status</th>
                  <th style={{ width: "10%" }}>Created At</th>
                  <th style={{ width: "10%" }}>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((item, index) => (
                  <tr key={item.support_id}>
                    <td>{indexOfFirstEntry + index + 1}</td>
                    <td>{item.name || "No name available"}</td>
                    <td>{item.email}</td>
                    <td>{item.user_role.charAt(0).toUpperCase() + item.user_role.slice(1)}</td>
                    <td>{item.description}</td>
                    <td>
                      <div className="status-div">
                      <span>{item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : ''}</span>                        <EditIcon
                          onClick={() => handleEditStatus(item)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    </td>
                    <td>
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })
                        .format(new Date(item.created_at))
                        .replace(",", "")}
                    </td>
                    <td>
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })
                        .format(new Date(item.updated_at))
                        .replace(",", "")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav className="d-flex justify-content-center">
            {renderPaginationItems()}
          </nav>
        </>
      )}

      {showModal && (
        <EditStatusModal
          support={selectedSupport}
          onClose={() => setShowModal(false)}
          onStatusChange={(newStatus) =>
            updateSupportStatus(selectedSupport.support_id, newStatus)
          }
          getSupportData={getSupportData}
        />
      )}
    </div>
  );
};

export default SupportCustomerTab;
