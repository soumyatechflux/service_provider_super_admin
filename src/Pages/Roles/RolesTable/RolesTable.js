import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";
import AddRoleModal from "./AddRoleModal/AddRoleModal";
import DeleteRoleModal from "./DeleteRoleModal/DeleteRoleModal";
import EditRoleModal from "./EditRoleModal/EditRoleModal";
import EditRoleStatusModal from "./EditRoleStatusModal/EditRoleStatusModal";
import "./RolesTable.css";

const RolesTable = () => {
  const [loading, setLoading] = useState(false); // Simulating loader state
  const [roles, setRoles] = useState([]);
  const [dummy_Data, setDummy_Data] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 


  // State for managing view more/less functionality
  const [expandedDescription, setExpandedDescription] = useState(
    new Array(dummy_Data.length).fill(false) // To track which description is expanded
  );

  const getRolesData = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );
      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/roles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      if (response?.status === 200 && response?.data?.success) {
        const data = response?.data?.data || [];
        setDummy_Data(data); // Populate dummy_Data with the fetched roles
      } else {
        toast.error(response.data.message || "Failed to fetch roles.");
      }
    } catch (error) {
      toast.error("Failed to load roles. Please try again.");
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
    setDummy_Data((prevData) =>
      prevData.map((item) =>
        item.id === updatedRole.id ? { ...item, ...updatedRole } : item
      )
    );
    setShowEditModal(false);
    toast.success("Role updated successfully!");
  };

  const handleEdit = (role) => {
    setSelectedRole(role); // Set the selected role for editing
    setShowEditModal(true);
  };

  const handleSave = (updatedRole) => {
    setRoles((prevRoles) =>
      prevRoles.map(
        (role) => (role.role_id === updatedRole.role_id ? updatedRole : role) // Update the role with the same role_id
      )
    );
    getRolesData(); // Re-fetch the roles after update
  };

  const handleEditClick = (role) => {
    setSelectedRole(role);
    setShowEditModal(true);
  };

  const handleDeleteClick = (role) => {
    setSelectedRole(role);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = (roleId) => {
    setDummy_Data((prevData) =>
      prevData.filter((item) => item.role_id !== roleId)
    );
    setShowDeleteModal(false);
  };

  const handleStatusClick = (role) => {
    setSelectedRole(role);
    setShowStatusModal(true);
  };

  const handleStatusChange = (newStatus) => {
    setDummy_Data((prevData) =>
      prevData.map((item) =>
        item.role_id === selectedRole.role_id
          ? { ...item, active_status: newStatus }
          : item
      )
    );
    setShowStatusModal(false);
    // toast.success("Role status updated successfully!");
  };

  const handleToggleDescription = (index) => {
    const newExpandedDescription = [...expandedDescription];
    newExpandedDescription[index] = !newExpandedDescription[index];
    setExpandedDescription(newExpandedDescription);
  };

  useEffect(() => {
    getRolesData(); // Fetch roles data on component mount
  }, []);


  const normalizeString = (str) => (str ? str.toLowerCase().trim() : "");
  const filteredRoles = roles.filter((role) => 
    normalizeString(role.role_name).includes(normalizeString(searchQuery)) ||
    normalizeString(role.description).includes(normalizeString(searchQuery)) ||
    normalizeString(role.active_status).includes(normalizeString(searchQuery))
  );
  return (
    <div className="SubCategory-Table-Main p-3">
        <h2>Roles</h2>
        <div
            className="mb-3"
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
        <button className="Discount-btn" onClick={() => setShowAddModal(true)}>
          + Add Role
        </button>
        <div className="search-bar" style={{ width: "350px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by role name, description, or status"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
                <th scope="col" style={{ width: "25%" }}>
                  Role Name
                </th>
                <th scope="col" style={{ width: "40%" }}>
                  Description
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Status
                </th>
                <th scope="col" style={{ width: "5%" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {dummy_Data.map((item, index) => {
                const descriptionWords = item.description?.split(" ") || [];
                const showFullDescription =
                  expandedDescription[index] || descriptionWords.length <= 5;
                const truncatedDescription = descriptionWords
                  .slice(0, 5)
                  .join(" ");

                return (
                  <tr key={item.id}>
                    <th scope="row">{index + 1}.</th>
                    <td>{item.role_name || "No role available"}</td>
                    <td>
                      <div>
                        {item.description && item.description.trim() !== ""
                          ? showFullDescription
                            ? item.description
                            : `${truncatedDescription}...`
                          : "No description available"}
                        {item.description &&
                          item.description.trim() !== "" &&
                          descriptionWords.length > 5 && (
                            <span
                              onClick={() => handleToggleDescription(index)}
                              style={{
                                color: "#007bff",
                                cursor: "pointer",
                                marginLeft: "5px",
                              }}
                            >
                              {showFullDescription ? "View Less" : "View More"}
                            </span>
                          )}
                      </div>
                    </td>

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
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDeleteClick(item)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AddRoleModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveRole}
      />

      <EditRoleModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSave} // Save the updated role to the parent component
        roleData={selectedRole} // Pass the selected role to the modal
      />
      <DeleteRoleModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        roleId={selectedRole?.role_id}
        getRolesData={getRolesData}
      />

      <EditRoleStatusModal
        open={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onStatusChange={handleStatusChange}
        role={selectedRole}
        initialStatus={selectedRole?.active_status} // Pass the active status
      />
    </div>
  );
};

export default RolesTable;
