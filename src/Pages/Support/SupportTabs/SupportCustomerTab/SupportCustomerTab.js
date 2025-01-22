import React, { useState, useEffect } from "react";
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
  const [searchInput, setSearchInput] = useState(""); // New state for search input

  const entriesPerPage = 10;

  const getSupportData = async () => {
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
        const data = response?.data?.data || [];
        setSupportData(data);
      } else {
        toast.error(
          response.data.message || "Failed to fetch support tickets."
        );
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      toast.error("Failed to load support tickets. Please try again.");
      setLoading(false);
    }
  };

  const onStatusChange = (newStatus) => {
    updateSupportStatus(selectedSupport.support_id, newStatus);
    getSupportData();
  };

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

  useEffect(() => {
    getSupportData();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  // Filtered entries based on search input
  const filteredData = supportData.filter((item) =>
    item.email.toLowerCase().includes(searchInput.toLowerCase())
  );

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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
    <div className="Support-Table-Main p-3">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Customer Support</h2>
        <input
          type="text"
          className="form-control search-input w-25"
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
            <table className="table table-bordered table-user">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Subject</th>
                  <th>Description</th>
                  <th style={{ width: "15%" }}>Status</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((item) => (
                  <tr key={item.support_id}>
                    <td>{item.support_id}</td>
                    <td>{item.email}</td>
                    <td>{item.user_role}</td>
                    <td>{item.subject || 'No subject available'}</td>
                    <td>{item.description}</td>
                    <td>
                      <div className="status-div">
                        <span>
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </span>
                        <EditIcon
                          onClick={() => handleEditStatus(item)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    </td>
                    <td>
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      {new Date(item.updated_at).toLocaleDateString()}
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
          onStatusChange={onStatusChange}
        />
      )}
    </div>
  );
};

export default SupportCustomerTab;
