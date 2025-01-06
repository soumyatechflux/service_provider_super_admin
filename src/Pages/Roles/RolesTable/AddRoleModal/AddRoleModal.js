import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddRoleModal.css";

const AddRoleModal = ({ show, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    roleName: "",
    description: "",
    permissions: {}, // Use object to map permission names to boolean values
  });

  const [permissionsList, setPermissionsList] = useState([]);
  const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

  useEffect(() => {
    if (show) {
      // Reset form data when modal opens
      setFormData({
        roleName: "",
        description: "",
        permissions: {},
      });

      // Fetch permissions data from API
      fetch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/permissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setPermissionsList(data.data); // Use full data for IDs
            const initialPermissions = data.data.reduce((acc, permission) => {
              acc[permission.permission_name] = false; // Initialize all as unselected
              return acc;
            }, {});
            setFormData((prevData) => ({
              ...prevData,
              permissions: initialPermissions,
            }));
          } else {
            toast.error("Failed to fetch permissions.");
          }
        })
        .catch((error) => {
          console.error("Error fetching permissions:", error);
          toast.error("An error occurred while fetching permissions.");
        });
    }
  }, [show, token]);

  const handleSelectAll = (isChecked) => {
    const updatedPermissions = permissionsList.reduce((acc, permission) => {
      acc[permission.permission_name] = isChecked;
      return acc;
    }, {});
    setFormData((prevData) => ({
      ...prevData,
      permissions: updatedPermissions,
    }));
  };

  const isAllSelected = permissionsList.every(
    (permission) => formData.permissions[permission.permission_name]
  );

  const handlePermissionChange = (permission, isChecked) => {
    setFormData((prevData) => ({
      ...prevData,
      permissions: {
        ...prevData.permissions,
        [permission.permission_name]: isChecked,
      },
    }));
  };

  const handleSave = async () => {
    if (!formData.roleName || !formData.description) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Extract selected permission IDs from formData.permissions
    const selectedPermissionIds = permissionsList
      .filter((permission) => formData.permissions[permission.permission_name])
      .map((permission) => permission.permission_id);

    if (selectedPermissionIds.length === 0) {
      toast.error("Please select at least one permission.");
      return;
    }

    const payload = {
      role: {
        role_name: formData.roleName,
        description: formData.description,
        permissions: selectedPermissionIds,
      },
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/roles/add`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data) {
        toast.success("Role added successfully!");
        onSave(payload.role);
        onClose();
      } else {
        toast.error(response.data.message || "Failed to add role.");
      }
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error("An error occurred while saving the role.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay modal-overlay-role">
      <div className="modal-content modal-content-role">
        <h2>Add New Role</h2>

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

        {/* Permissions */}
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
          <div className="permissions-container-role">
            <div className="row">
              {permissionsList.map((permission) => (
                <div className="col-md-6 form-check" key={permission.id}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={permission.permission_name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}
                    checked={
                      formData.permissions[permission.permission_name] || false
                    }
                    onChange={(e) =>
                      handlePermissionChange(permission, e.target.checked)
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor={permission.permission_name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}
                  >
                    {permission.permission_name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-actions-role">
          <button onClick={handleSave} className="btn btn-primary">
            Save
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoleModal;