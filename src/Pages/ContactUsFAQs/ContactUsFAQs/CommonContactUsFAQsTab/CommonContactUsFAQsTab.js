import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../../Loader/Loader";
import AddContactUsFAQsModal from "../AddContactUsFAQsModal/AddContactUsFAQsModal";
import EditContactUsFAQsModal from "../EditContactUsFAQsModal/EditContactUsFAQsModal";
import DeleteContactUsFAQsModal from "../DeleteContactUsFAQsModal/DeleteContactUsFAQsModal";

const CommonContactUsFAQsTab = ({ categoryID }) => {
  const [loading, setLoading] = useState(false);
  const [faqs, setFAQs] = useState([]);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/cms/contact_us_faqs`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response?.data?.success) {
        setFAQs(response.data.data || []);
      } else {
        toast.error(response.data.message || "Failed to fetch FAQs.");
      }
    } catch (error) {
      toast.error("Failed to fetch FAQs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, [categoryID]);

  const handleStatusChange = (newStatus) => {
    setFAQs(
      faqs.map((faq) =>
        faq.id === selectedFAQ.id
          ? { ...faq, active_status: newStatus }
          : faq
      )
    );
  };

  return (
    <div className="Restro-Table-Main p-3">
         {/* <h2>FAQs</h2> */}
      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive mb-5">
           <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Contact-Us FAQs</h2>
          <button
            className="Discount-btn"
            onClick={() => setShowAddModal(true)}
          >
            Add FAQ
          </button>
          </div>
          <table className="table table-bordered table-user">
            <thead>
              <tr>
                <th scope="col" style={{ width: "7%" }}>
                  Sr No.
                </th>
                <th scope="col" style={{ width: "33%" }}>
                  Question
                </th>
                <th scope="col" style={{ width: "43%" }}>
                  Answer
                </th>
                {/* <th scope="col" style={{ width: "10%" }}>
                  Status
                </th> */}
                <th scope="col" style={{ width: "7%" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {faqs.length > 0 ? (
                faqs.map((faq, index) => (
                  <tr key={faq.id}>
                    <td>{index + 1}</td>
                    <td>{faq.question}</td>
                    <td>{faq.answer}</td>
                    {/* <td>
                      <div className="status-div">
                        <span>
                          {faq.active_status === "active"
                            ? "Active"
                            : "InActive"}
                        </span>
                        <EditIcon
                          onClick={() => {
                            setSelectedFAQ(faq);
                            setShowStatusModal(true);
                          }}
                          style={{ cursor: "pointer", marginLeft: "10px" }}
                        />
                      </div>
                    </td> */}
                    <td>
                    <div className="status-div">
                      <EditIcon
                        onClick={() => {
                          setSelectedFAQ(faq);
                          setShowEditModal(true);
                        }}
                        style={{ cursor: "pointer", marginRight: "10px" }}
                      />
                      <DeleteIcon
                        onClick={() => {
                          setSelectedFAQ(faq);
                          setShowDeleteModal(true);
                        }}
                        style={{ cursor: "pointer", color: "red" }}
                      />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No FAQs available. Please add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <AddContactUsFAQsModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={(newFAQ) => setFAQs([...faqs, newFAQ])}
        categoryID={categoryID}
        fetchFAQs={fetchFAQs}
      />

      <EditContactUsFAQsModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={(updatedFAQ) =>
          setFAQs(
            faqs.map((faq) =>
              faq.id === updatedFAQ.id ? updatedFAQ : faq
            )
          )
        }
        categoryID={categoryID}
        fetchFAQs={fetchFAQs}

        faq={selectedFAQ}
      />

      <DeleteContactUsFAQsModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={(faqID) =>
          setFAQs(faqs.filter((faq) => faq.id !== faqID))
        }
        faq={selectedFAQ}
      />

      <EditContactUsFAQsModal
        faq={selectedFAQ}
        open={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default CommonContactUsFAQsTab;
