import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import Loader from "../../Loader/Loader";
import EditHelpCentreModal from "../EditHelpCentreModal/EditHelpCentreModal";


const HelpCentrePage = () => {
  const [helpData, setHelpData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);

  const entriesPerPage = 10;

  // Dummy Data (replace this with your actual API fetch)
  const fetchDummyData = () => {
    const dummyData = [
      {
        query_id: "1",
        name: "John Doe",
        email: "johndoe@example.com",
        service: "Cook",
        query: "How do I book a chef?",
        status: "Pending",
      },
      {
        query_id: "2",
        name: "Jane Smith",
        email: "janesmith@example.com",
        service: "Driver",
        query: "Can I change the pickup time?",
        status: "Resolved",
      },
      {
        query_id: "3",
        name: "Emily Johnson",
        email: "emilyj@example.com",
        service: "Gardener",
        query: "What services are included in gardening?",
        status: "Pending",
      },
      {
        query_id: "4",
        name: "Michael Brown",
        email: "michaelbrown@example.com",
        service: "Cook",
        query: "How do I make a reservation?",
        status: "Pending",
      },
    ];

    setHelpData(dummyData);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchDummyData();
  }, []);

  // Filtered Data Based on Search Input
  const filteredData = helpData.filter(
    (item) =>
      item.email.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.name?.toLowerCase().includes(searchInput.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

  const handleEditStatus = (queryData) => {
    setSelectedQuery(queryData);  // Set the selected query data
    setModalOpen(true); // Open the modal
  };

  const handleStatusChange = (queryId, newStatus) => {
    setHelpData((prevData) =>
      prevData.map((item) =>
        item.query_id === queryId ? { ...item, status: newStatus } : item
      )
    );
    toast.success("Status updated successfully!");
  };

  return (
    <div className="Help-Table-Main p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Help Centre Queries</h2>
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
                  <th>Sr. No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Service</th>
                  <th>Query</th>
                  <th style={{ width: "15%" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.length > 0 ? (
                  currentEntries.map((item, index) => (
                    <tr key={item.query_id}>
                      <td>{indexOfFirstEntry + index + 1}</td>
                      <td>{item.name || "No name available"}</td>
                      <td>{item.email}</td>
                      <td>{item.service}</td>
                      <td>{item.query}</td>
                      <td>
                        {item.status || "Pending"}{" "}
                        <EditIcon
                          onClick={() => handleEditStatus(item)}
                          style={{ cursor: "pointer", fontSize: "18px"}}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
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

          <EditHelpCentreModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onStatusChange={handleStatusChange}
            queryData={selectedQuery}
          />
        </>
      )}
    </div>
  );
};

export default HelpCentrePage;
