import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Loader from "../../Loader/Loader";

const PaymentHistoryModal = ({ open, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  useEffect(() => {
    if (open) {
      getPaymentHistory();
    }
  }, [open]);

  const getPaymentHistory = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/payment_history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);

      if (response.status === 200 && response.data.success) {
        setPaymentData(response.data.data || []);
      } else {
        toast.error(response.data.message || "Failed to fetch payment history.");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to load payment history. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const filteredData = paymentData.filter((item) => {
    const searchTerm = searchInput.toLowerCase();
    return (
      item.partner_name.toLowerCase().includes(searchTerm) ||
      item.category_name.toLowerCase().includes(searchTerm) ||
      item.payout_amount.toString().includes(searchTerm) ||
      item.payment_transaction_id.toLowerCase().includes(searchTerm) ||
      formatDate(item.created_at).includes(searchTerm) ||
      (item.tds_amount?.toString() || "").includes(searchTerm) ||
      (item.payout_amount_after_tds?.toString() || "").includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="payment-history-modal">
      <Box
        sx={{
          width: "80%",
          maxWidth: "900px",
          margin: "50px auto",
          bgcolor: "white",
          p: 3,
          borderRadius: 2,
          boxShadow: 24,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2 id="payment-history-modal">Payment History</h2>

        {/* Search Input */}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search by partner name or category..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ width: "300px" }}
        />

        {/* Table */}
        {loading ? (
          <Loader />
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Partner Id</th>
                  <th>Partner Name</th>
                  <th>Category</th>
                  <th>Created At</th>
                  <th>TDS Amount</th>
                  <th>Payout Amount</th>
                  <th>Payout Amount After TDS</th>
                  <th>Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">No data available</td>
                  </tr>
                ) : (
                  currentEntries.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1 + (currentPage - 1) * entriesPerPage}</td>
                      <td>{item.partner_id || "Unknown"}</td>
                      <td>{item.partner_name || "Unknown"}</td>
                      <td>{item.category_name || "N/A"}</td>
                      <td>{formatDate(item.created_at) || "N/A"}</td>
                      <td>{item.tds_amount || "N/A"}</td>
                      <td>{item.payout_amount_after_tds || "N/A"}</td>
                      <td>{item.payout_amount || "N/A"}</td>
                      <td>{item.payment_transaction_id || "N/A"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(1)}>First</button>
            </li>
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(number)}>{number}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>Next</button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(totalPages)}>Last</button>
            </li>
          </ul>
        </nav>

        {/* Close Button */}
        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-secondary" onClick={handleClose}>Close</button>
        </div>
      </Box>
    </Modal>
  );
};

export default PaymentHistoryModal;
