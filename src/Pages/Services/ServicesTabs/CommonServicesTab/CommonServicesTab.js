import React, { useState, useEffect } from "react";
import Loader from "../../../Loader/Loader";
import AddServiceModal from "../AddServiceModal/AddServiceModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditServiceModal from "../EditServiceModal/EditServiceModal";
import DeleteServiceModal from "../DeleteServiceModal/DeleteServiceModal";
import EditServiceStatusModal from "../EditServiceStatusModal/EditServiceStatusModal"; // Import the new modal
import axios from "axios";

const CommonServicesTab = ({ categoryId, subCategoryId }) => {
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false); // State to control EditServiceStatusModal visibility
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});


  const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/cms/services`,
        {
          params: { sub_category_id: subCategoryId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const filteredServices = response.data.data.filter(
        (service) => service.category_id === categoryId
      );
      setServices(filteredServices);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [categoryId, subCategoryId]);

  const handleAddService = async (formData) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/cms/services/add`,
        {
          ...formData,
          category_id: categoryId,
          sub_category_id: subCategoryId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        fetchServices();
      } else {
        console.error("Failed to add service:", response.data.message);
      }
    } catch (error) {
      console.error("Error adding service:", error);
    }
    setShowAddModal(false);
  };

  const handleToggleDescription = (id) => {
    setExpandedDescriptions((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };


  const handleEditClick = (service) => {
    setSelectedService(service);
    setShowEditModal(true);
  };

  const handleDeleteClick = (service) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  const handleEditStatusClick = (service) => {
    setSelectedService(service);
    setShowEditStatusModal(true);
  };

  const handleSaveEditedService = (updatedService) => {
    setServices(
      services.map((service) =>
        service.id === updatedService.id ? updatedService : service
      )
    );
  };

  const handleDeleteService = (id) => {
    setServices(services.filter((service) => service.id !== id));
  };

  const handleSaveEditedStatus = (updatedService) => {
    setServices(
      services.map((service) =>
        service.id === updatedService.id ? updatedService : service
      )
    );
  };

  return (
    <div className="Restro-Table-Main p-3">
        {/* <h2>Services</h2> */}
      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive mb-5">
          <button
            className="Discount-btn"
            onClick={() => setShowAddModal(true)}
          >
            Add Service
          </button>
          <table className="table table-bordered table-user">
            <thead>
              <tr>
                <th scope="col" style={{ width: "5%" }}>
                  Sr No.
                </th>
                <th scope="col" style={{ width: "20%" }}>
                  Title
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Image
                </th>
                <th scope="col" style={{ width: "40%" }}>
                  Description
                </th>
                {/* <th scope="col" style={{ width: "25%" }}>
                  URL
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Sub-Category ID
                </th> */}
                <th scope="col" style={{ width: "15%" }}>
                  Status
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {services.length > 0 ? (
                services.map((service, index) => (
                  <tr key={service.id}>
                    <td>{index + 1}</td>
                    <td>{service.title}</td>
                    <td>
                      <img
                        src={service.image}
                        alt="Service"
                        style={{ width: "100px", height: "auto" }}
                      />
                    </td>
                    <td>
                      {expandedDescriptions[service.id]
                        ? service.description
                        : service.description.split(" ").slice(0, 20).join(" ") +
                        (service.description.split(" ").length > 20 ? "..." : "")}
                      {service.description.split(" ").length > 20 && (
                        <button
                          onClick={() => handleToggleDescription(service.id)}
                          className="btn btn-link p-0 ms-2"
                          style={{ boxShadow: "none" }}
                        >
                          {expandedDescriptions[service.id] ? "View Less" : "View More"}
                        </button>
                      )}
                    </td>
                    {/* <td>{service.url}</td>
                    <td>{service.sub_category_id}</td> */}
                    <td>
                      <div className="status-div" style={{gap:"10px"}}>
                        {service.active_status.charAt(0).toUpperCase() + service.active_status.slice(1)}
                        <EditIcon
                          onClick={() => handleEditStatusClick(service)}
                          style={{ cursor: "pointer", marginRight: "10px" }}
                        />
                      </div>

                    </td>
                    <td>
                      <div className="status-div">
                        <EditIcon
                          onClick={() => handleEditClick(service)}
                          style={{ cursor: "pointer", marginRight: "10px" }}
                        />
                        <DeleteIcon
                          onClick={() => handleDeleteClick(service)}
                          style={{ cursor: "pointer", color: "red" }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No Services available. Please add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <AddServiceModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddService}
        categoryId={categoryId}
        subCategoryId={subCategoryId}
        fetchServices={fetchServices}
      />

      <EditServiceModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEditedService}
        service={selectedService}
      />

      <DeleteServiceModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={() => handleDeleteService(selectedService.id)} // Pass the correct function to handle deletion
        serviceId={selectedService ? selectedService.id : null}
      />


      <EditServiceStatusModal
        open={showEditStatusModal}
        service={selectedService}
        onClose={() => setShowEditStatusModal(false)}
        onStatusChange={handleSaveEditedStatus}
        fetchServices={fetchServices}
      />
    </div>
  );
};

export default CommonServicesTab;
