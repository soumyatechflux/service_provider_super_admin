import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";
import AddStaffModal from "./AddStaffModal/AddStaffModal";
import DeleteStaffModal from "./DeleteStaffModal/DeleteStaffModal";
import EditStaffModal from "./EditStaffModal/EditStaffModal";
import EditStaffStatusModal from "./EditStaffStatusModal/EditStaffStatusModal";

const StaffTable = ({}) => {
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState([]);
  const [dummy_Data, setDummy_Data] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [staffData, setStaffData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [itemsPerPage] = useState(10); // Number of items per page

  const getStaffData = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );
      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/staff`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      if (response?.status === 200) {
        const data = response?.data?.data || [];
        const normalizedData = data.map((item, index) => ({
          id: item.id || index + 1,
          ...item,
        }));
        setDummy_Data(normalizedData);
      } else {
        toast.error(response.data.message || "Failed to fetch staff.");
      }
    } catch (error) {
      toast.error("Failed to load staff. Please try again.");
      setLoading(false);
    }
  };

  const handleSaveRole = (newRole) => {
    setDummy_Data((prevData) => [
      ...prevData,
      { id: prevData.length + 1, ...newRole },
    ]);
    setShowAddModal(false);
  };

  const handleSaveEditRole = (updatedRole) => {
    if (!updatedRole?.id) {
      return;
    }

    setDummy_Data((prevData) =>
      prevData.map((item) =>
        item.id === updatedRole.id
          ? {
              ...item,
              ...updatedRole,
              staff_id: item.staff_id,
              role_id: item.role_id,
            }
          : item
      )
    );
    setShowEditModal(false);
  };

  const handleEdit = (role) => {
    if (!role || !role.id) {
      toast.error("Invalid role selected for editing.");
      return;
    }
    setSelectedRole(role);
    setShowEditModal(true);
  };

  useEffect(() => {
    getStaffData();
  }, []);

  const handleSave = (updatedRole) => {
    setStaff((prevStaff) =>
      prevStaff.map((role) =>
        role.role_id === updatedRole.role_id ? updatedRole : role
      )
    );
    getStaffData();
  };

  const handleEditClick = (role) => {
    setSelectedRole(role);
    setShowEditModal(true);
  };

  const handleDeleteClick = (staffId) => {
    setSelectedStaffId(staffId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = (deletedStaffId) => {
    setStaffData((prevData) =>
      prevData.filter((staff) => staff.staff_id !== deletedStaffId)
    );
    setShowDeleteModal(false);
  };

  const handleStatusClick = (item) => {
    setSelectedRole(item);
    setShowStatusModal(true);
  };

  const handleStatusChange = (newStatus) => {
    setDummy_Data((prevData) =>
      prevData.map((item) =>
        item.id === selectedRole.id
          ? { ...item, active_status: newStatus }
          : item
      )
    );
    setShowStatusModal(false);
  };

  // Search Logic
// Search Logic
const normalizeString = (str) => str?.replace(/\s+/g, ' ').trim().toLowerCase() || '';

const filteredData = dummy_Data.filter(
  (item) =>
    (item.name && normalizeString(item.name).includes(normalizeString(searchQuery))) ||
    (item.email && item.email.includes(searchQuery)) ||  // Exact match for email (case-sensitive)
    (item.role_name && normalizeString(item.role_name).includes(normalizeString(searchQuery)))
);



  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="SubCategory-Table-Main p-3">
      <h2>Staff</h2>
      <div
        className="mb-3"
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          className="Discount-btn mb-0"
          onClick={() => setShowAddModal(true)}
        >
          + Add Staff
        </button>

        {/* Search Input */}
        <div className="search-bar " style={{ width: "350px" }}>
          <input
            type="text"
            placeholder="Search by Name, Email, Role"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input mb-0"
          />
        </div>
      </div>

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
                <th scope="col" style={{ width: "20%" }}>
                  Name
                </th>
                <th scope="col" style={{ width: "20%" }}>
                  Email
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Phone No.
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Role Assigned
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Status
                </th>
                <th scope="col" style={{ width: "5%" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.id || index}>
                  <th scope="row">{index + 1}.</th>
                  <td>{item.name || "No staff available"}</td>
                  <td>{item.email || "No staff available"}</td>
                  <td>{item.mobile || "No staff available"}</td>
                  <td>{item.role_name || "No role available"}</td>
                  <td>
                    <div className="status-div">
                      <span>
                        {item.active_status === "active"
                          ? "Active"
                          : "InActive"}
                      </span>
                      <EditIcon
                        onClick={() => handleStatusClick(item)}
                        style={{ cursor: "pointer", marginLeft: "10px" }}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="status-div">
                      <EditIcon
                        style={{ cursor: "pointer", marginLeft: "10px" }}
                        onClick={() => handleEdit(item)}
                      />
                      <i
                        className="fa fa-trash text-danger"
                        style={{ cursor: "pointer", marginLeft: "10px" }}
                        onClick={() => handleDeleteClick(item.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}

      <AddStaffModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveRole}
        getStaffData={getStaffData}
      />

      <EditStaffModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEditRole}
        getStaffData={getStaffData}
        staffData={{
          staff_id: selectedRole?.id,
          name: selectedRole?.name,
          email: selectedRole?.email,
          mobile: selectedRole?.mobile,
          role_id: selectedRole?.role_id,
        }}
        roles={dummy_Data.map((item) => ({
          role_id: item.role_id,
          role_name: item.role_name,
        }))}
      />

      <DeleteStaffModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        staffId={selectedStaffId}
        getStaffData={getStaffData}
      />

      <EditStaffStatusModal
        open={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onStatusChange={handleStatusChange}
        staff={selectedRole}
        initialStatus={selectedRole?.active_status}
      />
    </div>
  );
};

export default StaffTable;
