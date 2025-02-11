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
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPaginationItems = () => {
    const pageRange = getPageRange();

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
                  {filters.user_type === "customer" && (
                    <th scope="col" style={{ width: "10%" }}>
                      Customer Name
                    </th>
                  )}
                  {filters.user_type === "partner" && (
                    <th scope="col" style={{ width: "10%" }}>
                      Partner Name
                    </th>
                  )}
                  <th scope="col" style={{ width: "10%" }}>
                    Category
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Sub Category
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Visit Slot Count
                  </th>
                  <th scope="col" style={{ width: "5%" }}>
                    Amount
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Commission
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
                    {filters.user_type === "customer" && (
                      <td>{item.customer?.name || item.guest_name || "N/A"}</td>
                    )}
                    {filters.user_type === "partner" && (
                      <td>{item.partner?.name || "Unknown"}</td>
                    )}
                    <td>{item.category?.category_name || "N/A"}</td>
                    <td>
                      {item.sub_category_name?.sub_category_name || "N/A"}
                    </td>
                    <td>{item.gardener_visiting_slot_count || "NA"}</td>
                    <td>{item.price || "No status"}</td>
                    <td>{item.commission_amount || "0.00"}</td>
                    <td>{item.address_from || "No address available."}</td>
                    <td>
                      {item.booking_status?.charAt(0).toUpperCase() +
                        item.booking_status.slice(1) || "N/A"}
                    </td>
                    <td>
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(item.created_at))}
                    </td>
                    <td>
                    <div style={{ textAlign: "center" }}>
                          <button
                            className="btn Discount-btn"
                            style={{
                              display: "block",
                              backgroundColor: "#2F4CDD",
                              color: "white",
                              padding: "5px 10px",
                              borderRadius: "5px",
                              border: "none",
                            }}
                            onClick={() => handleViewDetails(item)}
                          >
                            View
                          </button>
                        </div>
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
