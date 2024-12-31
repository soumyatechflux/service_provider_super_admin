import React, { useEffect, useState } from "react";
import Loader from "../../../Loader/Loader";
import axios from "axios";
import { toast } from "react-toastify";
import EditStatusModal from "./EditStatusModal/EditStatusModal";

const CommonBookingTab = ({ category_id, loading, setLoading }) => {
  const [dummy_Data, setDummy_Data] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedBookingStatus, setSelectedBookingStatus] = useState(null);
  const [partnerId, setPartnerId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);

  const entriesPerPage = 10;

  const getCommissionData = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );
      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      if (response?.status === 200 && response?.data?.success) {
        const data = response?.data?.data || [];
        const filteredData = data.filter(
          (item) => item.category_id === parseInt(category_id, 10)
        );
        setDummy_Data(filteredData);
      } else {
        toast.error(response.data.message || "Failed to fetch bookings.");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCommissionData();
  }, [category_id]);

  const handleOpenEditModal = (
    bookingId,
    bookingStatus,
    partnerId,
    categoryId
  ) => {
    // Log the values being set
    console.log("Opening modal with values:", {
      bookingId,
      bookingStatus,
      partnerId,
      categoryId,
    });

    setSelectedBookingId(bookingId);
    setSelectedBookingStatus(bookingStatus);
    setPartnerId(partnerId);
    setCategoryId(categoryId);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  // Pagination calculations
  const totalPages = Math.ceil(dummy_Data.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = dummy_Data.slice(indexOfFirstEntry, indexOfLastEntry);

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
            }}
          >
            Next
          </button>
        </li>
      </ul>
    );
  };

  return (
    <div className="SubCategory-Table-Main p-3">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="table-responsive mb-5">
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
                    Sub Category
                  </th>
                  <th scope="col" style={{ width: "5%" }}>
                    Amount
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Address
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Booking Date
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Status
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
                      {item.sub_category_name?.sub_category_name || "Unknown"}
                    </td>
                    <td>{item.price || "N/A"}</td>
                    <td>
                      {item.address_from || "No current_address available."}
                    </td>
                    <td>
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(item.created_at))}
                    </td>
                    <td>
                      {item.booking_status || "No current_address available."}
                    </td>
                    <td>
                      {["upcoming", "inprogress"].includes(
                        item.booking_status
                      ) ? (
                        <i
                          className="fa fa-pencil-alt text-primary"
                          style={{ cursor: "pointer", color: "black" }}
                          onClick={() =>
                            handleOpenEditModal(
                              item.booking_id,
                              item.booking_status,
                              item.partner_id,
                              item.category_id
                            )
                          }
                        />
                      ) : (
                        <i
                          className="fa fa-pencil-alt"
                          style={{
                            cursor: "not-allowed",
                            color: "gray",
                          }}
                        />
                      )}
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

      {/* Edit Status Modal */}
      {/* <EditStatusModal
          open={showEditModal}
          onClose={handleCloseEditModal}
          bookingId={selectedBookingId}
          partnerId={partnerId}
          categoryId={categoryId}
          getCommissionData={getCommissionData}
          onStatusUpdate={handleStatusUpdate}
        /> */}
      <EditStatusModal
        open={showEditModal}
        onClose={handleCloseEditModal}
        bookingId={selectedBookingId}
        partnerId={partnerId}
        categoryId={categoryId}
        getCommissionData={getCommissionData}
        dummyData={dummy_Data}
        setDummyData={setDummy_Data}
        setShowEditModal={setShowEditModal}
      />
    </div>
  );
};

export default CommonBookingTab;
