import React, { useEffect, useState } from "react";
import Loader from "../../../Loader/Loader";
import axios from "axios";
import { toast } from "react-toastify";
import BookingDetailsModal from "../BookingDetailsModal/BookingDetailsModal";

const ReportTable = ({ filters, loading, setLoading }) => {
  const [reportData, setReportData] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  const fetchReportData = async () => {
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
      setLoading(true);
  
      const validFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== "" && value !== null
        )
      );
  
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/reporting/bookings`,
        {
          params: validFilters,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setLoading(false);
  
      if (response?.status === 200 && response?.data?.success) {
        setReportData(response?.data?.data || []);
      } else {
        toast.error(response.data.message || "Failed to fetch report.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast.error("Failed to load report data. Please try again.");
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReportData();
  }, [filters]);
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Enables smooth scrolling
    });
  }, [currentPage]);
  

  useEffect(() => {
    if (loading) {
      fetchReportData();
    }
  }, [filters, loading]); // Trigger fetch when filters or loading change
  
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  // Pagination calculations
  const totalPages = Math.ceil(reportData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = reportData.slice(indexOfFirstEntry, indexOfLastEntry);

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
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            style={{
              border: "1px solid #dee2e6",
              borderRadius: "4px",
              padding: "8px 12px",
              color: currentPage === 1 ? "#6c757d" : "#007bff",
              backgroundColor: "white",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              textDecoration: "none",
            }}
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
                border: "1px solid #dee2e6",
                borderRadius: "4px",
                padding: "8px 12px",
                backgroundColor: currentPage === number ? "#007bff" : "white",
                color: currentPage === number ? "white" : "#007bff",
                cursor: "pointer",
                minWidth: "40px",
                textAlign: "center",
                textDecoration: "none",
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
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            style={{
              border: "1px solid #dee2e6",
              borderRadius: "4px",
              padding: "8px 12px",
              color: currentPage === totalPages ? "#6c757d" : "#007bff",
              backgroundColor: "white",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              textDecoration: "none",
            }}
          >
            Next
          </button>
        </li>
      </ul>
    );
  };

  return (
    <div className="report-table p-3">
      {loading ? (
        <Loader />
      ) : reportData.length === 0 ? (
        <div className="no-data-message text-center">
          <p style={{ fontWeight: "bold", fontSize: "20px" }}>
            No data available based on the applied filters.
          </p>
        </div>
      ) : (
        <>
          <div className="table-responsive mb-3">
            <table className="table table-bordered table-user">
              <thead className="heading_user">
                <tr>
                  <th scope="col" style={{ width: "5%" }}>
                    Sr.
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Customer Name
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Partner Name
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                   Category
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Sub Category
                  </th>
                  <th scope="col" style={{ width: "5%" }}>
                    Amount
                  </th>
                  <th scope="col" style={{ width: "15%" }}>
                    Address
                  </th>
                  <th scope="col" style={{ width: "5%" }}>
                    Status
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Booking Date
                  </th>
                  <th scope="col" style={{ width: "5%" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((item, index) => (
                  <tr key={item.booking_id}>
                    <th scope="row">{indexOfFirstEntry + index + 1}.</th>
                    <td>{item.guest_name || "N/A"}</td>
                    <td>{item.partner?.name || "Unknown"}</td>
                    <td>
  {item.category?.category_name || "N/A"}
</td>

                    <td>
                      {item.sub_category_name?.sub_category_name || "N/A"}
                    </td>
                    <td>{item.price || "No status"}</td>
                    <td>
                      {item.address_from || "No current_address available."}
                    </td>
                    <td>
                      {item.booking_status || "No current_address available."}
                    </td>
                    <td>
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(item.created_at))}
                    </td>
                    <td>
                      <button
                        className="btn Discount-btn"
                        onClick={() => handleViewDetails(item)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <nav
            aria-label="Page navigation"
            className="d-flex justify-content-center"
          >
            {renderPaginationItems()}
          </nav>
        </>
      )}

      {isModalOpen && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ReportTable;
