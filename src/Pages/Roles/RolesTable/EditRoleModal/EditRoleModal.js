import React, { useState, useEffect } from "react";
import axios from "axios"; // Using axios to make API requests
import { toast } from "react-toastify"; // Import react-toastify for toasts
import "react-toastify/dist/ReactToastify.css"; // Import the toast CSS
import "./EditRoleModal.css";

const EditRoleModal = ({ show, onClose, onSave, roleData,getRolesData }) => {
  const [formData, setFormData] = useState({
    roleName: "",
    description: "",
    permissions: [],
  });

  const [permissionsList, setPermissionsList] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false); // Track if all checkboxes are selected
  const [loading, setLoading] = useState(false); // Track loading state
  const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

  // Fetch permissions from API
  useEffect(() => {
    if (show) {
      const fetchPermissions = async () => {
        try {
          setLoading(true); // Start loading
          const response = await axios.get(
            `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/permissions`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setLoading(false); // Stop loading
          if (response?.data?.success) {
            setPermissionsList(response?.data?.data || []);
          } else {
            toast.error("Failed to fetch permissions.");
          }
        } catch (error) {
          setLoading(false); // Stop loading
          console.error("Error fetching permissions:", error);
          toast.error("Error fetching permissions.");
        }
      };

      fetchPermissions();
    }
  }, [show, token]);

  // Update the formData state when roleData is passed as a prop
  useEffect(() => {
    if (roleData) {
      setFormData({
        roleName: roleData.role_name,
        description: roleData.description || "",
        permissions: roleData.permissions.map((perm) => perm.permission_id), // Extract permission IDs
      });
    }
  }, [roleData]);

  const handlePermissionChange = (permissionId, isChecked) => {
    setFormData((prevData) => {
      const updatedPermissions = isChecked
        ? [...prevData.permissions, permissionId] // Add permission ID
        : prevData.permissions.filter((id) => id !== permissionId); // Remove permission ID
      return { ...prevData, permissions: updatedPermissions };
    });
  };

  const handleSelectAll = (isChecked) => {
    setIsAllSelected(isChecked);
    setFormData((prevData) => {
      const updatedPermissions = isChecked
        ? permissionsList.map((permission) => permission.permission_id)
        : [];
      return { ...prevData, permissions: updatedPermissions };
    });
  };

  const handleSave = async () => {
    if (!formData.roleName || !formData.description || formData.permissions.length === 0) {
      toast.error("Please fill in all fields, including selecting at least one permission.");
      return;
    }

    try {
      setLoading(true); // Start loading
      const updatedRole = {
        role: {
          role_id: roleData.role_id, // Include role_id inside the 'role' object
          role_name: formData.roleName,
          description: formData.description,
          permissions: formData.permissions,  // Send selected permissions
        }
      };

      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/roles`,
        updatedRole, // Send the role data with the role object inside the payload
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false); // Stop loading

      if (response?.status === 200 && response?.data?.success) {
        toast.success("Role updated successfully!");
        onSave(updatedRole.role); // Pass updated role to parent
        onClose(); // Close the modal
        
      } else {
        toast.error(response?.data?.message || "Failed to update role.");
      }
    } catch (error) {
      setLoading(false); // Stop loading
      console.error("Error updating role:", error);
      toast.error("An error occurred while updating the role. Please try again.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Role</h2>

        {/* Role Name Field */}
        <div className="form-group">
          <label htmlFor="role-name">Role Name:</label>
          <input
            id="role-name"
            name="roleName"
            value={formData.roleName}
            onChange={(e) =>
              setFormData({ ...formData, roleName: e.target.value })
            }
            placeholder="Enter role name"
            className="form-control"
          />
        </div>

        {/* Description Field */}
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter description"
            className="form-control"
            rows={4}
          />
        </div>

        {/* Permissions with Select All */}
        <div className="form-group">
          <label>Permissions:</label>
          <div className="form-check form-check-all">
            <input
              type="checkbox"
              className="form-check-input form-check-input-all"
              id="select-all"
              checked={isAllSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <label
              className="form-check-label form-check-label-all"
              htmlFor="select-all"
            >
              Select All
            </label>
          </div>
          <div className="row">
            {permissionsList.map((permission) => (
              <div className="col-md-6" key={permission.permission_id}>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={permission.permission_id}
                    checked={formData.permissions.includes(permission.permission_id)} // Check if permission is selected
                    onChange={(e) =>
                      handlePermissionChange(permission.permission_id, e.target.checked)
                    }
                  />
                  <label className="form-check-label" htmlFor={permission.permission_id}>
                    {permission.permission_name}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-actions">
          <button onClick={handleSave} className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRoleModal;
