import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../Loader/Loader";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
import EditReviewModal from "../EditReviewModal/EditReviewModal";
import EditIcon from "@mui/icons-material/Edit";

const PartnerReviewTabs = () => {
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  const getSupportData = async () => {
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/customer_ratings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);
      if (response?.status === 200 && response?.data?.success) {
        setReviewData(response?.data?.data || []);
      } else {
        toast.error(response.data.message || "Failed to fetch reviews.");
      }
    } catch (error) {
      toast.error("Failed to load reviews. Please try again.");
      setLoading(false);
    }
  };

  const handleDeleteReview = async (review) => {
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
      setLoading(true);
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/ratings/${review.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);
      if (response?.status === 200 && response?.data?.success) {
        toast.success("Review deleted successfully.");
        setReviewData((prevData) => prevData.filter((item) => item.id !== review.id));
        setShowDeleteModal(false);
      } else {
        toast.error(response.data.message || "Failed to delete review.");
      }
    } catch (error) {
      toast.error("Failed to delete review. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getSupportData();
  }, []);

  const normalizeString = (str) =>
    str?.toString().replace(/\s+/g, " ").trim().toLowerCase() || "";

  const filteredData = reviewData.filter((item) => {
    const searchTerm = normalizeString(searchInput);

    // Ensure that if the input is empty, return all data
    if (!searchTerm) return true;

    // Normalize all fields except image
    const bookingId = item.booking_id?.toString() || "";
    const customerName = normalizeString(item.customer?.name);
    const partnerName = normalizeString(item.partner?.name);
    const rating = item.rating?.toString() || "";
    const review = normalizeString(item.review);
    const comment = normalizeString(item.comment);

    // Format created_at to "11 Feb 2025" for searching
    const createdAtFormatted = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(item.created_at));

    return (
      bookingId.includes(searchTerm) ||
      customerName.includes(searchTerm) ||
      partnerName.includes(searchTerm) ||
      rating.includes(searchTerm) ||
      review.includes(searchTerm) ||
      comment.includes(searchTerm) ||
      normalizeString(createdAtFormatted).includes(searchTerm)
    );
  });

  return (
    <div className="Support-Table-Main p-3">
      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Customer Review</h2>
            <input
              type="text"
              className="form-control search-input w-25"
              placeholder="Search by customer rating, review, or date..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <table className="table table-bordered table-user">
            <thead className="heading_user">
              <tr>
                <th scope="col">Sr.</th>
                <th scope="col">Booking ID</th>
                <th scope="col">Customer</th>
                <th scope="col">Partner</th>
                <th scope="col">Rating</th>
                <th scope="col">Reviews</th>
                <th scope="col">Image</th>
                <th scope="col">Created At</th>
                <th scope="col">Comments</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row">{index + 1}.</th>
                    <td>{item.booking_id || "N/A"}</td>
                    <td>{item.customer?.name || "N/A"}</td>
                    <td>{item.partner?.name || "N/A"}</td>
                    <td style={{ fontWeight: "bold" }}>{item.rating || "N/A"}</td>
                    <td>{item.review || "No review provided."}</td>
                    <td>
                      {item.attachment ? (
                        <a href={item.attachment} target="_blank" rel="noopener noreferrer">
                          <img src={item.attachment} alt="Customer" style={{ width: "50px", height: "50px", cursor: "pointer" }} />
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(item.created_at))}
                    </td>
                    <td>{item.comment || "N/A"}</td>
                    <td className="action-btn-trash">
                      <div className="status-div">
                        <i
                          className="fa fa-trash text-danger"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedReview(item);
                            setShowDeleteModal(true);
                          }}
                        ></i>
                        <EditIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedReview(item);
                            setShowEditModal(true);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center">No reviews available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Delete Review Modal */}
      <DeleteReviewModal show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} handleDelete={handleDeleteReview} review={selectedReview} />
      {/* Edit Review Modal */}
      <EditReviewModal open={showEditModal} onClose={() => setShowEditModal(false)} review={selectedReview} fetchReviews={getSupportData} />
    </div>
  );
};

export default PartnerReviewTabs;
