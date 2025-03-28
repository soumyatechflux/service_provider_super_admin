import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";
import EditRefundAndCancellationModal from "../EditRefundAndCancellationModal/EditRefundAndCancellationModal";

const CommonRefundTab = ({ category_id }) => {
  const [refundData, setRefundData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const entriesPerPage = 10;

  const getRefundData = async () => {
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/refunds`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);

      if (response?.status === 200 && response?.data?.success) {
        setRefundData(response?.data?.data || []);
      } else {
        toast.error(response.data?.message || "Failed to fetch refund data.");
      }
    } catch (error) {
      console.error("Error fetching refund data:", error);
      toast.error("Failed to load refund data. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getRefundData();
  }, []);

  // Filter data based on category_id
  const filteredData = refundData
  .filter((item) => item?.category_id == category_id)
  .filter((item) => {
    const searchLower = searchInput.toLowerCase().trim();

    // Extracting values safely
    const guestName = item?.guest_name?.toLowerCase() || "";
    const subCategoryName =
      typeof item?.sub_category_name === "object"
        ? item?.sub_category_name?.sub_category_name?.toLowerCase() || ""
        : item?.sub_category_name?.toLowerCase() || "";
    const billingAmount = item?.billing_amount?.toString() || "";

    const cancellationAmount = item?.cancel_charge_amount?.toString() || "";

    const bookingIDD = item?.booking_id?.toString() || "";



    const refundAmount = item?.refund_amount?.toString() || "";
    const razorpayPaymentId = item?.razorpay_payment_id?.toLowerCase() || "";
    const paymentMode =
      item?.payment_mode ? item.payment_mode.charAt(0).toUpperCase() + item.payment_mode.slice(1) : "";

    // Special case for when searching "refunded"
    if (searchLower === "refunded") {
      return (
        guestName.includes(searchLower) ||
        subCategoryName.includes(searchLower) ||
        billingAmount.includes(searchLower) ||
        bookingIDD.includes(searchLower) ||
        cancellationAmount.includes(searchLower) ||
        refundAmount.includes(searchLower) ||
        razorpayPaymentId.includes(searchLower) ||
        paymentMode.toLowerCase().includes(searchLower) ||
        item?.is_refund === 1 // Only show refunded items
      );
    }

    // Special case for when searching "not refunded"
    if (searchLower === "not refunded") {
      return (
        guestName.includes(searchLower) ||
        subCategoryName.includes(searchLower) ||
        billingAmount.includes(searchLower) ||
        refundAmount.includes(searchLower) ||
        bookingIDD.includes(searchLower) ||
        cancellationAmount.includes(searchLower) ||
        razorpayPaymentId.includes(searchLower) ||
        paymentMode.toLowerCase().includes(searchLower) ||
        item?.is_refund === 0 // Only show not refunded items
      );
    }

    // Default behavior for other searches (customer, amount, status)
    return (
      guestName.includes(searchLower) ||
      subCategoryName.includes(searchLower) ||
      billingAmount.includes(searchLower) ||
      refundAmount.includes(searchLower) ||
      razorpayPaymentId.includes(searchLower) ||
      paymentMode.toLowerCase().includes(searchLower)
    );
  });




  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);


  
  const handlePayNowClick = (refund) => {
    setSelectedRefund(refund);
    setShowModal(true);
  };

  return (
    <div className="Refund-Table-Main p-3">
      <div className="d-flex justify-content-end align-items-center mb-3">
        <input
          type="text"
          className="form-control search-input w-25"
          placeholder="Search by customer, amount, or status..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive mb-5">
          <table className="table table-bordered table-user">
            <thead className="heading_user">
              <tr>
                <th>Sr. No.</th>
                <th>Customer Name</th>
                <th>Booking ID </th>

                <th>Sub Category</th>
                <th>Billing Amount</th>
                <th>Refund Amount</th>
                <th>Cancellation Amount</th>

                <th>Razer Pay Payment Id</th>
                <th>Payment Mode</th>
                <th>Refund Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.length > 0 ? (
                currentEntries.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{index + 1 + (currentPage - 1) * entriesPerPage}</td>
                    <td>{item?.guest_name || "N/A"}</td>

                    <td>{item?.booking_id || "N/A"}</td>


                    <td>
                      {typeof item?.sub_category_name === "object"
                        ? item?.sub_category_name?.sub_category_name || "N/A"
                        : item?.sub_category_name || "N/A"}
                    </td>
                    <td>{item?.billing_amount || "N/A"}</td>
                    <td>{item?.refund_amount || "N/A"}</td>

                    <td>{item?.cancel_charge_amount || "N/A"}</td>


                    <td>{item?.razorpay_payment_id || "N/A"}</td>
                    <td>{item?.payment_mode ? item.payment_mode.charAt(0).toUpperCase() + item.payment_mode.slice(1) : "N/A"}</td>
                    <td style={{ color: item?.is_refund === 0 ? "red" : "black" }}>

                    {item?.payment_mode === "cod" ? "---" : item?.is_refund === 0 ? "Not Refunded" : "Refunded"}


                    </td>
                    <td>
                    <button
  className="payNow-btn"
  style={{
    backgroundColor: (item?.is_refund === 1 || item?.payment_mode === "cod") ? "#ccc" : "#007bff",
    cursor: (item?.is_refund === 1 || item?.payment_mode === "cod") ? "not-allowed" : "pointer",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
  }}
  disabled={item?.is_refund === 1 || item?.payment_mode === "cod"}
  onClick={() => handlePayNowClick(item)}
>
  Edit
</button>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center">
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Refund Confirmation Modal */}
    {selectedRefund && (
   <EditRefundAndCancellationModal
    show={showModal}
    onClose={() => setShowModal(false)}
    bookingId={selectedRefund.booking_id} 
    refundAmount={selectedRefund.refund_amount}
    isRefunded={selectedRefund.is_refund}
    getRefundData={getRefundData}
  />
)}

    </div>
  );
};

export default CommonRefundTab;
