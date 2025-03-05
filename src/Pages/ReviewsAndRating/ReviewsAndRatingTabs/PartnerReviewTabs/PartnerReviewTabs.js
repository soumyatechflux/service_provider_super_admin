import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../Loader/Loader";
import DeleteReviewModal from "./../DeleteReviewModal/DeleteReviewModal"; // Import the modal
import EditIcon from "@mui/icons-material/Edit";
import EditReviewModal from "../EditReviewModal/EditReviewModal";


const PartnerReviewTabs = () => {
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [searchInput, setSearchInput] = useState(""); // Search input state

  const getSupportData = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );

      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/partner_ratings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      if (response?.status === 200 && response?.data?.success) {
        const data = response?.data?.data || [];
        setReviewData(data);
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
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );

      setLoading(true);

      const response = await axios.delete(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/ratings/${review.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      if (response?.status === 200 && response?.data?.success) {
        toast.success("Review deleted successfully.");
        setReviewData((prevData) =>
          prevData.filter((item) => item.id !== review.id)
        );
        setShowModal(false);
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


  
  const categoryMap = {
    1: "Cook",
    2: "Driver",
    3: "Gardener",
  };
  
  const normalizeString = (str) =>
    str?.toString().replace(/\s+/g, " ").trim().toLowerCase() || "";
  
  const filteredData = reviewData.filter((item) => {
    const searchTerm = normalizeString(searchInput);
  
    // Check if search input is a number (for booking_id & rating)
    const isNumericSearch = !isNaN(searchInput) && searchInput.trim() !== "";
  
    // Format created_at to "11 Feb 2025"
    const createdAtFormatted = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(item.created_at));
  
    // Get category name based on category_id
    const categoryName = categoryMap[item.category_id] || "N/A";
  
    return (
      (isNumericSearch
        ? String(item.booking_id).includes(searchInput.trim()) || // Strict search by booking_id
          String(item.rating).includes(searchInput.trim()) // Also allow rating search
        : 
        // Otherwise, search across all fields
        normalizeString(item.customer?.name).includes(searchTerm) ||
        normalizeString(item.partner?.name).includes(searchTerm) ||
        normalizeString(item.rating).includes(searchTerm) || 
        normalizeString(item.review).includes(searchTerm) ||
        normalizeString(item.comment).includes(searchTerm) ||
        normalizeString(createdAtFormatted).includes(searchTerm) || 
        normalizeString(categoryName).includes(searchTerm) 
      )
    );
  });
  

  return (
    <div className="Support-Table-Main p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
      <h2>Partner Review</h2>
      <input
        type="text"
        className="form-control search-input w-25 mb-3"
        placeholder="Search by partner rating, review, or date..."
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
                <th scope="col" style={{ width: "5%" }}>Sr.</th>
                <th scope="col" style={{ width: "5%" }}>Booking ID.</th>
                <th scope="col" style={{ width: "15%" }}>Partner</th>
                <th scope="col" style={{ width: "15%" }}>Customer</th>
                <th scope="col" style={{ width: "10%" }}>Category</th>
                <th scope="col" style={{ width: "10%" }}>Rating</th>
                <th scope="col" style={{ width: "30%" }}>Reviews</th>
                <th scope="col" style={{ width: "30%" }}>Images</th>
                <th scope="col" style={{ width: "10%" }}>Created At</th>
                <th scope="col" style={{ width: "10%" }}>comments</th>
                <th scope="col" style={{ width: "10%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row">{index + 1}.</th>
                    <td>{item.booking_id || "N/A"}</td>
                    <td>{item.partner?.name || "N/A"}</td>
                    <td>{item.customer?.name || "N/A"}</td>
                    <td>{(() => {const categoryMap = {
      1: "Cook",
      2: "Driver",
      3: "Gardener",
    };
    return categoryMap[item.category_id] || "N/A";
  })()}
</td>
                    <td style={{ fontWeight: "bold" }}>{item.rating || "N/A"}</td>
                    <td>
                      {item.attachment ? (
                        <img
                          src={item.attachment}
                          alt="Customer"
                          style={{
                            width: "50px",
                            height: "50px",
                          }}
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>

                    <td>{item.review || "No review provided."}</td>
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
                          setShowModal(true);
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
      <DeleteReviewModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleDelete={handleDeleteReview}
        review={selectedReview}
      />
  <EditReviewModal open={showEditModal} onClose={() => setShowEditModal(false)} review={selectedReview} fetchReviews={getSupportData} />

    </div>
  );
};

export default PartnerReviewTabs;
