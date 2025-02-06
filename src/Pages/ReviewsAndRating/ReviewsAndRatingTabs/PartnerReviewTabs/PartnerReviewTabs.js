import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../Loader/Loader";
import DeleteReviewModal from "./../DeleteReviewModal/DeleteReviewModal"; // Import the modal

const PartnerReviewTabs = () => {
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

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
        setLoading(false);
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
        // Remove the deleted review from the local state
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

  return (
    <div className="Support-Table-Main p-3">
        {/* <h2>Partner Review and Rating</h2> */}
      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive mb-5">
          <table className="table table-bordered table-user">
            <thead className="heading_user">
              <tr>
                <th scope="col" style={{ width: "5%" }}>
                  Sr.
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Partner
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Customer
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Rating
                </th>
                <th scope="col" style={{ width: "30%" }}>
                  Review
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Created At
                </th>
                {/* <th scope="col" style={{ width: "10%" }}>
                  Updated At
                </th> */}
                <th scope="col" style={{ width: "10%" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {reviewData.length > 0 ? (
                reviewData.map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row">{index + 1}.</th>
                    <td>{item.partner?.name || "N/A"}</td>
                    <td>{item.customer?.name || "N/A"}</td>
                    <td style={{ fontWeight: "bold" }}>{item.rating || "N/A"}</td>
                    <td>{item.review || "No review provided."}</td>
                    <td>
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(item.created_at))}
                    </td>
                    {/* <td>
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(item.updated_at))}
                    </td> */}
                    <td className="action-btn-trash">
                      <i
                        className="fa fa-trash text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setSelectedReview(item);
                          setShowModal(true);
                        }}
                      ></i>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No reviews available.
                  </td>
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
    </div>
  );
};

export default PartnerReviewTabs;

