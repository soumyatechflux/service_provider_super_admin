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
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );
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
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput]);
 
  const categoryMap = {
    "cook": 1,
    "driver": 2,
    "gardener": 3,
  };
  
  const normalizeString = (str) =>
    str?.toString().replace(/\s+/g, " ").trim().toLowerCase() || "";
  
  const filteredData = supportData.filter((item) => {
    const searchTerm = normalizeString(searchInput);
  
    // Function to format date as MM/DD/YYYY
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };
  
    // Check if the search term matches a category name
    const categoryIdMatch = categoryMap[searchTerm];
  
    if (categoryIdMatch !== undefined) {
      // If the search term is a category, filter only by category_id
      return item.category_id === categoryIdMatch;
    }
  
    // Otherwise, perform normal search on other fields
    return (
      normalizeString(item.email ?? "").includes(searchTerm) ||
      normalizeString(item.name ?? "").includes(searchTerm) ||
      normalizeString(item.mobile ?? "").includes(searchTerm) ||
      normalizeString(item.description ?? "").includes(searchTerm) ||
      normalizeString(formatDate(item.created_at)).includes(searchTerm) ||
      normalizeString(formatDate(item.updated_at)).includes(searchTerm) ||
      normalizeString(item.status ?? "").includes(searchTerm) ||
      normalizeString(item.priority ?? "").includes(searchTerm) ||
      normalizeString(item.assign ?? "").includes(searchTerm)
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
                  <th>Category</th>
                  <th>Description</th>
                  <th>Attachments</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Assign To</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th scope="col" style={{ width: "5%" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
  {currentEntries.length > 0 ? (
    currentEntries.map((item, index) => (
      <tr key={item.id}>
        <td>{indexOfFirstEntry + index + 1}</td>
        <td>{item.name || "No name available"}</td>
        <td>{item.mobile || "N/A"}</td>
        <td>{(() => {const categoryMap = {
      1: "Cook",
      2: "Driver",
      3: "Gardener",
    };
    return categoryMap[item.category_id] || "N/A";
  })()}
</td>

        <td>{item.description || "N/A"}</td>
        <td>
  {item.attachment ? (
    /\.(jpg|jpeg|png|gif)$/i.test(item.attachment) ? (
      // Image preview
      <a href={item.attachment} target="_blank" rel="noopener noreferrer">
        <img
          src={item.attachment}
          alt="Attachment"
          style={{ width: "50px", height: "50px", cursor: "pointer" }}
        />
      </a>
    ) : /\.(pdf)$/i.test(item.attachment) ? (
      // PDF preview
      <embed
        src={item.attachment}
        type="application/pdf"
        width="100"
        height="100"
        style={{ cursor: "pointer" }}
      />
    ) : /\.(doc|docx|xls|xlsx)$/i.test(item.attachment) ? (
      // Word & Excel preview using Google Docs Viewer in iframe
      <iframe
        src={`https://docs.google.com/gview?url=${encodeURIComponent(
          item.attachment
        )}&embedded=true`}
        style={{ width: "50px", height: "50px", border: "none" }}
      ></iframe>
    ) : (
      // Fallback for other file types
      <a href={item.attachment} target="_blank" rel="noopener noreferrer">
        View File
      </a>
    )
  ) : (
    "N/A"
  )}
</td>

        <td>{new Date(item.created_at).toLocaleDateString()}</td>
        <td>{new Date(item.updated_at).toLocaleDateString()}</td>
        <td>{item.assign || "Not Assign Yet"}</td>
        <td>{item.priority || "N/A"}</td>
        <td>
          <div className="status-div">
            <span>
              {item.status
                ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
                : "New"}
            </span>
            <EditIcon
              onClick={() => handleEditStatus(item)}
              style={{ cursor: "pointer" }}
            />
          </div>
        </td>
        <td>
          <button
            className="btn Discount-btn"
            onClick={() => setSelectedBookingId(item.booking_id)}
          >
            View
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="11" style={{ textAlign: "center", padding: "10px" }}>
        No Data Available
      </td>
    </tr>
  )}
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
