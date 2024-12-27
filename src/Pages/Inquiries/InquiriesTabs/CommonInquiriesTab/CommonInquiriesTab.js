import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../Loader/Loader";
import FollowUpModal from "../FollowUpModal/FollowUpModal";

const CommonInquiriesTab = () => {
  const dummyData = [
    {
      id: "1",
      customer_name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      inquiry_type: "Service Request",
      message:
        "I would like to know more about your premium cleaning services.",
      date_received: "2023-12-01",
      status: "Pending",
    },
    {
      id: "2",
      customer_name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "987-654-3210",
      inquiry_type: "Complaint",
      message: "The cleaning team missed a spot in the kitchen.",
      date_received: "2023-12-05",
      status: "Resolved",
    },
    {
      id: "3",
      customer_name: "Bob Johnson",
      email: "bob.johnson@example.com",
      phone: "555-666-7777",
      inquiry_type: "Feedback",
      message: "Great service! The team was professional and thorough.",
      date_received: "2023-12-10",
      status: "Closed",
    },
  ];

  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

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

  const handleOpenFollowUpModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowFollowUpModal(true);
  };

  const handleCloseFollowUpModal = () => {
    setSelectedInquiry(null);
    setShowFollowUpModal(false);
  };

  const handleSaveFollowUp = (note) => {
    console.log("Resolution Note:", note);
    // TODO: Add logic to save the follow-up note to the backend or update the state
    toast.success("Follow-up note saved successfully.");
  };

  const handleOpenDeleteModal = (item) => {
    setSelectedSubCategory(item);
    setShowDeleteModal(true);
  };



  useEffect(() => {
    fetchSubCategoryData();
  }, []);

  return (
    <div className="SubCategory-Table-Main p-3">
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
                 Name
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Email
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Phone
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Inquiry Type
                </th>
                <th scope="col" style={{ width: "25%" }}>
                  Message
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Received
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Status
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {dummyData.map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}.</th>
                  <td>{item.customer_name || "N/A"}</td>
                  <td>{item.email || "N/A"}</td>
                  <td>{item.phone || "N/A"}</td>
                  <td>{item.inquiry_type || "N/A"}</td>
                  <td>{item.message || "No message provided."}</td>
                  <td>
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(item.date_received))}
                  </td>
                  <td>{item.status || "Pending"}</td>
                  <td className="action-btn-pay">   
                      <button
                        className="payNow-btn p-2"
                        onClick={() => handleOpenFollowUpModal(item)}
                      >
                        Follow Up
                      </button>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FollowUpModal
          show={showFollowUpModal}
          onClose={handleCloseFollowUpModal}
          inquiry={selectedInquiry}
          onSave={(data) => {
            console.log("Resolution Details:", data);
            toast.success("Follow-up saved successfully.");
            handleCloseFollowUpModal(); // Close modal after saving
          }}
      />
    </div>
  );
};

export default CommonInquiriesTab;
