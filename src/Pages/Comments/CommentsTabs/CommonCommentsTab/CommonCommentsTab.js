import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../Loader/Loader";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteCommentModal from "../../DeleteCommentModal/DeleteCommentModal";

const CommonCommentsTab = () => {
    const dummyData = [
        {
          id: "1",
          user_name: "John Doe",
          comment: "The service was excellent! I will definitely recommend it.",
          rating: 5,
          date_posted: "2023-12-01",
          status: "Visible",
        },
        {
          id: "2",
          user_name: "Jane Smith",
          comment: "The service was decent, but the timings were off.",
          rating: 3,
          date_posted: "2023-12-05",
          status: "Hidden",
        },
        {
          id: "3",
          user_name: "Bob Johnson",
          comment: "Poor service, would not recommend to others.",
          rating: 1,
          date_posted: "2023-12-10",
          status: "Visible",
        },
      ];

  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState(dummyData); // State for comments
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const fetchSubCategoryData = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );

      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/sub_category_by_category_id/aaaaaaaaaaaaaaaaaaaaaaa`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      if (response?.status === 200 && response?.data?.success) {
        const data = response?.data?.data || [];
        // setPricingData(data);
      } else {
        toast.error(response.data.message || "Failed to fetch sub-categories.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Failed to load sub-categories. Please try again.");
      setLoading(false);
    }
  };


  const handleOpenDeleteModal = (comment) => {
    setSelectedComment(comment);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedComment(null);
    setShowDeleteModal(false);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      // Simulate API call
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      toast.success("Comment deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete the comment. Please try again.");
    }
  };



  useEffect(() => {
    fetchSubCategoryData();
  }, []);

  return (
    <div className="Comments-Table-Main p-3">
      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive mb-5">
          <table className="table table-bordered table-user">
            <thead className="heading_user">
              <tr>
                <th scope="col" style={{ width: "5%" }}>#</th>
                <th scope="col" style={{ width: "20%" }}>User Name</th>
                <th scope="col" style={{ width: "35%" }}>Comment</th>
                {/* <th scope="col" style={{ width: "10%" }}>Rating</th> */}
                <th scope="col" style={{ width: "15%" }}>Posted On</th>
                <th scope="col" style={{ width: "10%" }}>Status</th>
                <th scope="col" style={{ width: "10%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {dummyData.map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.user_name || "N/A"}</td>
                  <td>{item.comment || "No comment provided."}</td>
                  {/* <td>{item.rating || "N/A"}</td> */}
                  <td>
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(item.date_posted))}
                  </td>
                  <td>{item.status || "N/A"}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <DeleteIcon
                        className="text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleOpenDeleteModal(item)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              
            </tbody>
          </table>
          
        </div>
        
      )}
      {/* Delete Comment Modal */}
      {showDeleteModal && (
        <DeleteCommentModal
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          handleDelete={handleDeleteComment}
          comment={selectedComment}
        />
      )}
    </div>
  );
};

export default CommonCommentsTab;

