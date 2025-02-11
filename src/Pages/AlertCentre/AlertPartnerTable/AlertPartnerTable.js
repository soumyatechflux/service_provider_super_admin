import React, { useState, useEffect } from "react";
import Loader from "../../Loader/Loader";
import AddPartnerModal from "./AddPartnerModal/AddPartnerModal";

const AlertPartnerTable = () => {
  const [alertData, setAlertData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const entriesPerPage = 10;

  // Fetching alert data from API
  const fetchAlertData = async () => {
    setLoading(true);
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

    if (!token) {
      console.error("Token not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/notifications?role=partner`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch alerts.");
      }

      const data = await response.json();

      // Assuming the API returns data in the format { success: true, data: [...] }
      if (data.success) {
        // Filter notifications from the last 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const filteredNotifications = (data.data || []).filter((notification) => {
          const notificationDate = new Date(notification.created_at);
          return notificationDate >= twentyFourHoursAgo;
        });

        setAlertData(filteredNotifications);
      } else {
        console.error("Failed to fetch valid alert data.");
        setAlertData([]);
      }
    } catch (error) {
      console.error("Error fetching alert data:", error);
      setAlertData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertData();
  }, []);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two digits
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`; // MM/DD/YYYY format
  };
  
  // Helper function to normalize strings for comparison
  const normalizeString = (str) =>
    str?.toString().replace(/\s+/g, " ").trim().toLowerCase() || "";

  // Updated filtering logic: search by title, message, notification_type, role, or created_at
  const filteredData = alertData.filter((item) => {
    const searchTerm = normalizeString(searchInput);
    return (
      normalizeString(item.title).includes(searchTerm) ||
      normalizeString(item.message).includes(searchTerm) ||
      normalizeString(item.notification_type).includes(searchTerm) ||
      normalizeString(item.role).includes(searchTerm) ||
      normalizeString(formatDate(item.created_at)).includes(searchTerm) 
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <div className="Alert-Table-Main p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="Discount-btn mb-0" onClick={() => setModalOpen(true)}>
          Add Notification
        </button>

        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by title, message, type, role or date..."
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
                  <th>Title</th>
                  <th>Message</th>
                  <th>Notification Type</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.length > 0 ? (
                  currentEntries.map((item, index) => (
                    <tr key={item.notification_id}>
                      <td>{indexOfFirstEntry + index + 1}</td>
                      <td>{item.title}</td>
                      <td>{item.message}</td>
                      <td>{item.notification_type || "N/A"}</td>
                      <td>
                        {new Date(item.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
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
                    style={{
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    }}
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
                    style={{
                      cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    }}
                  >
                    Last
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}

      <AddPartnerModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(newAlert) => {
          // Prepend new alert to the list
          const newAlertWithDetails = {
            ...newAlert,
            notification_id: Date.now().toString(),
            created_at: new Date().toISOString(),
            role: "partner",
          };
          setAlertData([newAlertWithDetails, ...alertData]);
          setModalOpen(false);
        }}
        fetchAlertData={fetchAlertData}
      />
    </div>
  );
};

export default AlertPartnerTable;
