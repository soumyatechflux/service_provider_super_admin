import React, { useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import axios from "axios";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import AddStaffModal from "./AddStaffModal/AddStaffModal";
import EditStaffModal from "./EditStaffModal/EditStaffModal";
import EditStaffStatusModal from "./EditStaffStatusModal/EditStaffStatusModal";
import DeleteStaffModal from "./DeleteStaffModal/DeleteStaffModal";

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
        // Removed the toast.success message
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
      // toast.error("Updated role is missing an id.");
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
    console.log("Editing role:", role); 
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
      prevStaff.map(
        (role) => (role.role_id === updatedRole.role_id ? updatedRole : role) 
      )
    );
    getStaffData(); 
  };

  const handleEditClick = (role) => {
    setSelectedRole(role);
    setShowEditModal(true);
  };

 

 
  

  useEffect(() => {
    getStaffData();
  }, []);







  const handleDeleteClick = (staffId) => {
    setSelectedStaffId(staffId); // Set the staff ID to delete
    setShowDeleteModal(true); // Show the delete modal
  };

  const handleConfirmDelete = (deletedStaffId) => {
    setStaffData((prevData) =>
      prevData.filter((staff) => staff.staff_id !== deletedStaffId)
    );
    setShowDeleteModal(false); // Close the modal
  };

  const handleStatusClick = (item) => {
    console.log("Selected Staff:", item);
    setSelectedRole(item); // Correctly pass the entire item
    setShowStatusModal(true);
  };
  
  
  

  const handleStatusChange = (newStatus) => {
    setDummy_Data((prevData) =>
      prevData.map((item) =>
        item.id === selectedRole.id ? { ...item, active_status: newStatus } : item
      )
    );
    setShowStatusModal(false);
    // toast.success("Role status updated successfully!");
  };

  return (
    <div className="SubCategory-Table-Main p-3">
      <div style={{ float: "right" }}>
        <button className="Discount-btn" onClick={() => setShowAddModal(true)}>
          + Add Staff
        </button>
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
                <th scope="col" style={{ width: "20%" }}>
                  Phone No.
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Status
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {dummy_Data.map((item, index) => (
                <tr key={item.id || index}>
                  <th scope="row">{index + 1}.</th>
                  <td>{item.name || "No staff available"}</td>
                  <td>{item.email || "No staff available"}</td>
                  <td>{item.mobile || "No staff available"}</td>
                  <td>
                  <div className="status-div">
                      <span>
                        {item.active_status === "active"
                          ? "Active"
                          : "In-Active"}
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
        }}
      />

<DeleteStaffModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        staffId={selectedStaffId}
        getStaffData = {getStaffData}
      />

      <EditStaffStatusModal
        open={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onStatusChange={handleStatusChange}
        staff={selectedRole} // Pass the selected role (should be staff)
        initialStatus={selectedRole?.active_status} // Pass the active status
      />
    </div>
  );
};

export default StaffTable;
