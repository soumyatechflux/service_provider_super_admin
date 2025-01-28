import React, { useEffect, useState } from "react";
import Loader from "../../../Loader/Loader";
import axios from "axios";
import { toast } from "react-toastify";
import EditStatusModal from "./EditStatusModal/EditStatusModal";
import AttachmentModal from "./AttachmentModal/AttachmentModal";

const CommonBookingTab = ({ category_id, loading, setLoading }) => {
  function formatDateWithTime(dateString) {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "N/A";
    }

    // Date format (Day Month Year)
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);

    // Time format (AM/PM)
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 12 AM/PM instead of 0
    minutes = minutes < 10 ? "0" + minutes : minutes; // Add leading zero to minutes if necessary

    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return `${formattedDate}, ${formattedTime}`;
  }

  const formatPaymentMode = (mode) => {
    if (!mode) return "N/A"; // Handle null/undefined
    if (mode.toLowerCase() === "online") return "Online";
    if (mode.toLowerCase() === "cod") return "COD";
    return mode.charAt(0).toUpperCase() + mode.slice(1); // Default behavior
  };
  const [dummy_Data, setDummy_Data] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedBookingStatus, setSelectedBookingStatus] = useState(null);
  const [partnerId, setPartnerId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [attachmentsData, setAttachmentsData] = useState({});

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

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  const handleOpenEditModal = (
    bookingId,
    bookingStatus,
    partnerId,
    categoryId
  ) => {
    setSelectedBookingId(bookingId);
    setSelectedBookingStatus(bookingStatus);
    setPartnerId(partnerId);
    setCategoryId(categoryId);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleOpenAttachmentModal = (attachments) => {
    setAttachmentsData(attachments);
    setShowAttachmentModal(true);
  };

  const handleCloseAttachmentModal = () => {
    setShowAttachmentModal(false);
  };

  // const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

  const filteredData = dummy_Data.filter((item) =>
    item.guest_name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const currentEntries = filteredData.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    // Hide pagination if filtered data is less than or equal to entriesPerPage
    if (filteredData.length <= entriesPerPage) return null;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <nav>
        <ul
          className="pagination justify-content-center"
          style={{ gap: "5px" }}
        >
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
          </li>
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`page-item ${currentPage === number ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(number)}
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
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  return (
    <div className="SubCategory-Table-Main p-3">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Bookings</h2>
        <input
          type="text"
          className="form-control search-input w-25"
          placeholder="Search by guest name..."
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
                  {(category_id === "1" || category_id === "3") && (
  <th scope="col" style={{ width: "10%" }}>
    Address 
  </th>
)}

                  {category_id === "2" && (
                    <th scope="col" style={{ width: "10%" }}>
                      Address From
                    </th>
                  )}
                  {category_id === "2" && (
                    <th scope="col" style={{ width: "10%" }}>
                      Address To
                    </th>
                  )}
                  <th scope="col" style={{ width: "15%" }}>
                    Visited Date
                  </th>
                  <th scope="col" style={{ width: "15%" }}>
                    Booking Date
                  </th>

                  <th scope="col" style={{ width: "10%" }}>
                    Payment Mode
                  </th>
                  {category_id === "3" && (
                    <th scope="col" style={{ width: "10%" }}>
                      Visit Slot Count
                    </th>
                  )}
                  <th scope="col" style={{ width: "10%" }}>
                    Status
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    Attachments
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
                    <td>{item.partner?.name || "Not assigned yet"}</td>
                    <td>
                      {item.sub_category_name?.sub_category_name || "Unknown"}
                    </td>
                    <td>{item.billing_amount || "N/A"}</td>

                    {(category_id === "1" || category_id === "3") && (
                    <td>
                      {item.visit_address || "No current_address available."}
                    </td>
                    )}
                    {category_id === "2" && (
                      <td>
                        {item.address_from || "No current_address available."}
                      </td>
                    )}
                    {category_id === "2" && (
                      <td>
                        {item.address_to || "No current_address available."}
                      </td>
                    )}
                    <td>
                      {item.visit_date
                        ? formatDateWithTime(item.visit_date)
                        : "N/A"}
                    </td>

                    <td>
                      {item.created_at
                        ? formatDateWithTime(item.created_at)
                        : "N/A"}
                    </td>

                    <td>{formatPaymentMode(item.payment_mode)}</td>

                    {category_id === "3" && (
                      <td>{item.gardener_visiting_slot_count || "NA"}</td>
                    )}

                    <td>
                      {item.booking_status
                        ? item.booking_status.charAt(0).toUpperCase() +
                          item.booking_status.slice(1)
                        : "No current_address available."}
                    </td>

                    <td>
                      {item.start_job_attachments.length > 0 ||
                      item.end_job_attachments.length > 0 ? (
                        <i
                          className="fa fa-eye text-primary"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handleOpenAttachmentModal({
                              start: item.start_job_attachments,
                              end: item.end_job_attachments,
                            })
                          }
                        />
                      ) : (
                        "No Attachments"
                      )}
                    </td>
                    <td>
                      <i
                        className={`fa fa-pencil-alt ${
                          ["upcoming", "inprogress"].includes(
                            item.booking_status
                          )
                            ? "text-primary"
                            : "text-muted"
                        }`}
                        style={{
                          cursor: ["upcoming", "inprogress"].includes(
                            item.booking_status
                          )
                            ? "pointer"
                            : "not-allowed",
                        }}
                        onClick={() =>
                          ["upcoming", "inprogress"].includes(
                            item.booking_status
                          )
                            ? handleOpenEditModal(
                                item.booking_id,
                                item.booking_status,
                                item.partner_id,
                                item.category_id
                              )
                            : null
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination()}
        </>
      )}

      <AttachmentModal
        open={showAttachmentModal}
        attachments={attachmentsData}
        onClose={handleCloseAttachmentModal}
      />

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
