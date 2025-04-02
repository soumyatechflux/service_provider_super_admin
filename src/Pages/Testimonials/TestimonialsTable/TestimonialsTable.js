import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";
import EditIcon from "@mui/icons-material/Edit";
import AddTestimonialsModal from "../AddTestimonialsModal/AddTestimonialsModal";
import EditTestimonialModal from "../EditTestimonialModal/EditTestimonialModal";
import DeleteTestimonialModal from "../DeleteTestimonialModal/DeleteTestimonialModal";

const TestimonialsTable = () => {
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  const entriesPerPage = 10;
  const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [testimonialToDelete, setTestimonialToDelete] = useState(null);

const handleDeleteClick = (testimonial) => {
  setTestimonialToDelete(testimonial);
  setShowDeleteModal(true);
};

const removeTestimonialFromTable = (deletedId) => {
  setTestimonialsData((prev) => prev.filter((item) => item.id !== deletedId));
  setShowDeleteModal(false);
};

  const getTestimonialsData = useCallback(async () => {
    if (!token) {
      console.error("No token found, authorization failed.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/cms/testimonials`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.status === 200 && response?.data?.success) {
        setTestimonialsData(response?.data?.data || []);
      } else {
        toast.error(response?.data?.message || "Failed to fetch testimonials.");
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast.error("Failed to load testimonials. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getTestimonialsData();
  }, [getTestimonialsData]);

  // Add new testimonial to table without refreshing
  const addTestimonialToTable = (newTestimonial) => {
    setTestimonialsData((prevTestimonials) => [newTestimonial, ...(prevTestimonials || [])]);
  };

  // Handle edit click to open EditTestimonialModal
  const handleEditClick = (testimonial) => {
    if (!testimonial || typeof testimonial !== "object") {
      toast.error("Invalid testimonial data.");
      return;
    }
    setSelectedTestimonial(testimonial);
    setShowEditModal(true);
  };

  // Update testimonial data after editing
  const updateTestimonialInTable = (updatedTestimonial) => {
    if (!updatedTestimonial || !updatedTestimonial.id) {
      console.error("Invalid updated testimonial data:", updatedTestimonial);
      return;
    }

    setTestimonialsData((prevTestimonials) =>
      prevTestimonials.map((item) =>
        item.id === updatedTestimonial.id ? updatedTestimonial : item
      )
    );
  };

  // Ensure testimonialsData is always an array before filtering
  const filteredData = (testimonialsData || []).filter((item) =>
    item?.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
    item?.comment?.toLowerCase().includes(searchInput.toLowerCase()) ||
    item?.rating?.toString().includes(searchInput)
  );


  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <div className="Testimonials-Table-Main p-3">
      <div className="SubCategory-Table-Main p-3">
        <h2>Testimonials</h2>
        <div className="mb-3" style={{ display: "flex", justifyContent: "space-between" }}>
         
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
           <button className="Discount-btn" onClick={() => setShowAddModal(true)}>
            + Add Testimonials
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive mb-5">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Name</th>
                <th>Description</th>
                <th>Ratings</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.length > 0 ? (
                currentEntries.map((item, index) => (
                  <tr key={item?.id || index}>
                    <td>{indexOfFirstEntry + index + 1}</td>
                    <td>{item?.name || "N/A"}</td>
                    <td>{item?.comment || "N/A"}</td>
                    <td>{item?.rating || "N/A"}</td>
                    <td>
                    <div className="status-div">
                      <EditIcon style={{ cursor: "pointer" }} onClick={() => handleEditClick(item)} />
                      <i className="fa fa-trash text-danger" style={{ cursor: "pointer" }} onClick={() => handleDeleteClick(item)} />
              </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No testimonials found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <AddTestimonialsModal show={showAddModal} onClose={() => setShowAddModal(false)} addTestimonialToTable={addTestimonialToTable}getTestimonialsData={getTestimonialsData}
 />

      {selectedTestimonial && (
        <EditTestimonialModal show={showEditModal} onClose={() => setShowEditModal(false)} testimonialData={selectedTestimonial} onUpdate={updateTestimonialInTable} />
      )}

<DeleteTestimonialModal
  show={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={removeTestimonialFromTable}
  testimonialId={testimonialToDelete?.id}
/>
    </div>
  );
};

export default TestimonialsTable;
