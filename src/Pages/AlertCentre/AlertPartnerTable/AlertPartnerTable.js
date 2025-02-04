import React, { useState, useEffect } from "react";
import Loader from "../../Loader/Loader"; // Assuming this is a loader component you've defined
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
            "Authorization": `Bearer ${token}`,
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
        setAlertData(data.data || []);
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

  // Filtered Data Based on Search Input
  const filteredData = alertData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.message.toLowerCase().includes(searchInput.toLowerCase())
  );

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
          placeholder="Search by title or message..."
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
                  <th>Notification Type</th> {/* New column for Notification Type */}
                </tr>
              </thead>
              <tbody>
                {currentEntries.length > 0 ? (
                  currentEntries.map((item, index) => (
                    <tr key={item.alert_id}>
                      <td>{indexOfFirstEntry + index + 1}</td>
                      <td>{item.title}</td>
                      <td>{item.message}</td>
                      <td>{item.notification_type || "N/A"}</td> {/* Display Notification Type */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center"> {/* Adjusted for the new column */}
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
        </>
      )}

      <AddPartnerModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(newAlert) => {
          setAlertData([...alertData, { alert_id: (alertData.length + 1).toString(), ...newAlert }]);
          setModalOpen(false);
        }}
        fetchAlertData={fetchAlertData}
      />
    </div>
  );
};

export default AlertPartnerTable;
