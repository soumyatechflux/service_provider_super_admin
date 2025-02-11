import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Loader from "../../../Loader/Loader";
import { toast } from "react-toastify";
import EditStatusModal from "./../SupportCustomerTab/EditStatusModal/EditStatusModal";
import EditIcon from "@mui/icons-material/Edit";
import ViewSupportDetails from "../ViewSupportDetails/ViewSupportDetails";

const SupportCustomerTab = () => {
  const [supportData, setSupportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSupport, setSelectedSupport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const entriesPerPage = 10;

  // Fetch Support Data
  const getSupportData = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/help_center`,
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

  // Normalization function to ensure a consistent comparison
  const normalizeString = (str) =>
    str?.toString().replace(/\s+/g, " ").trim().toLowerCase() || "";

  // Filter supportData using multiple fields: name, email, mobile, description, created_at, and updated_at
  const filteredData = supportData.filter((item) => {
    const searchTerm = normalizeString(searchInput);
  
    // Function to format date as MM/DD/YYYY
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };
  
    return (
      normalizeString(item.email ?? "").includes(searchTerm) ||
      normalizeString(item.name ?? "").includes(searchTerm) ||
      normalizeString(item.mobile ?? "").includes(searchTerm) ||
      normalizeString(item.description ?? "").includes(searchTerm) ||
      normalizeString(formatDate(item.created_at)).includes(searchTerm) || // Formatted date search
      normalizeString(formatDate(item.updated_at)).includes(searchTerm) || // Formatted date search
      normalizeString(item.status ?? "").includes(searchTerm)
    );
  });
  

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
        item.id === supportId ? { ...item, status: newStatus } : item
      )
    );
  };

  return (
    <div className="Support-Table-Main p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Customer Support</h2>
        <input
          type="text"
          className="form-control w-25"
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
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th scope="col" style={{ width: "5%" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((item, index) => (
                  <tr key={item.id}>
                    <td>{indexOfFirstEntry + index + 1}</td>
                    <td>{item.name || "No name available"}</td>
                    <td>{item.mobile}</td>
                    <td>{item.description}</td>
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
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                    <td>{new Date(item.updated_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn Discount-btn"
                        onClick={() => setSelectedBookingId(item.booking_id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* You can add your pagination controls here if needed */}
        </>
      )}

      {/* Edit Status Modal */}
      {showModal && selectedSupport && (
        <EditStatusModal
          support={selectedSupport}
          onClose={() => setShowModal(false)}
          onStatusChange={(newStatus) =>
            updateSupportStatus(selectedSupport.id, newStatus)
          }
          getSupportData={getSupportData}
        />
      )}

      {/* View Support Details Modal */}
      {selectedBookingId && (
        <ViewSupportDetails
          bookingId={selectedBookingId}
          onClose={() => setSelectedBookingId(null)}
        />
      )}
    </div>
  );
};

export default SupportCustomerTab;
