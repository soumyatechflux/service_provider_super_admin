import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EditRoleModal.css";

const EditRoleModal = ({ show, onClose, onSave, roleData, getRolesData }) => {
  const [formData, setFormData] = useState({
    roleName: "",
    description: "",
    permissions: [],
  });
  const [initialFormData, setInitialFormData] = useState({
    roleName: "",
    description: "",
    permissions: [],
  });

  const [permissionsList, setPermissionsList] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

  // Fetch permissions from API
  useEffect(() => {
    if (show) {
      const fetchPermissions = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/permissions`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setLoading(false);
          if (response?.data?.success) {
            setPermissionsList(response?.data?.data || []);
          } else {
            toast.error("Failed to fetch permissions.");
          }
        } catch (error) {
          setLoading(false);
          console.error("Error fetching permissions:", error);
          toast.error("Error fetching permissions.");
        }
      };

      fetchPermissions();
    }
  }, [show, token]);

  // Update formData when roleData is passed as a prop
 // Update formData when roleData is passed as a prop
useEffect(() => {
  if (roleData) {
    const selectedPermissions = roleData.permissions.map((perm) => perm.permission_id);

    setFormData({
      roleName: roleData.role_name,
      description: roleData.description || "",
      permissions: selectedPermissions,
    });

    setInitialFormData({
      roleName: roleData.role_name,
      description: roleData.description || "",
      permissions: selectedPermissions,
    });

    // Check if all permissions are selected
    const allSelected = permissionsList.length > 0 && permissionsList.every((perm) => selectedPermissions.includes(perm.permission_id));
    setIsAllSelected(allSelected);
  }
}, [roleData, permissionsList]);


  // Reset form data when modal is closed (but keep previous data on reopen)
  useEffect(() => {
    if (!show) {
      setFormData(initialFormData); // Keep the previous data when reopening modal
      setIsAllSelected(false); // Reset Select All checkbox
    }
  }, [show, initialFormData]);

  const handlePermissionChange = (permissionId, isChecked) => {
    setFormData((prevData) => {
      const updatedPermissions = isChecked
        ? [...prevData.permissions, permissionId]
        : prevData.permissions.filter((id) => id !== permissionId);
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
      setLoading(true);
      const updatedRole = {
        role: {
          role_id: roleData.role_id,
          role_name: formData.roleName,
          description: formData.description,
          permissions: formData.permissions,
        }
      };

      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/roles`,
        updatedRole,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      if (response?.status === 200 && response?.data?.success) {
        toast.success("Role updated successfully!");
        onSave(updatedRole.role);
        onClose(); // Close the modal
      } else {
        toast.error(response?.data?.message || "Failed to update role.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating role:", error);
      toast.error("An error occurred while updating the role. Please try again.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay modal-overlay-role">
      <div className="modal-content-role modal-content">
        <h2>Edit Role</h2>

        {/* Role Name Field */}
        <div className="form-group form-group-role">
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
        <div className="form-group form-group-role">
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
        <div className="form-group form-group-role">
          <label>Permissions:</label>
          <div className="form-check form-check-role form-check-all">
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
                    checked={formData.permissions.includes(permission.permission_id)}
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
        <div className="modal-actions modal-actions-role">
          <button onClick={handleSave} className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button onClick={onClose} className="btn btn-secondary" style={{ width: "100%" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRoleModal;
