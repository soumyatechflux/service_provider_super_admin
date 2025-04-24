import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../Loader/Loader";
import EditIcon from "@mui/icons-material/Edit";
import EditSettingModal from "../EditSettingModal/EditSettingModal";

const SettingsTable = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 

  const getSettingsTableData = async () => {
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/settings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoading(false);
      if (response?.data?.success) {
        setSettings(response.data.data || []);
      } else {
        toast.error(response.data.message || "Failed to fetch settings.");
      }
    } catch (error) {
      console.error("Error fetching settings data:", error);
      toast.error("Failed to load settings. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getSettingsTableData();
  }, []);

  const handleEditClick = (setting) => {
    setSelectedSetting(setting);
    setShowEditModal(true);
  };

  const handleSave = async (updatedSetting) => {
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

      const payload = {
        setting: {
          config_id: updatedSetting.config_id,
          config_value: updatedSetting.config_value,
          description: updatedSetting.description,
        },
      };

      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/settings`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.data?.success) {
        toast.success("Setting updated successfully!");
        await getSettingsTableData();
        setShowEditModal(false);
      } else {
        throw new Error(response.data.message || "Failed to update setting.");
      }
    } catch (error) {
      console.error("Error updating setting:", error.response || error.message);
      toast.error(error.response?.data?.error || "Failed to update setting. Please try again.");
    }
  };

  const normalizeString = (str) => str?.replace(/\s+/g, " ").trim().toLowerCase() || "";

  // **Corrected Search Logic**
  const filteredData = settings.filter((item) => {
    const searchTerm = normalizeString(searchQuery);

    return (
      normalizeString(item.title).includes(searchTerm) ||
      normalizeString(item.config_key).includes(searchTerm) ||
      normalizeString(item.config_value).includes(searchTerm) ||
      normalizeString(item.description).includes(searchTerm)
    );
  });

  return (
    <div className="Restro-Table-Main p-3">
      <h2>Settings</h2>
      <div className="search-bar mb-3" style={{ width: "350px" }}>
        <input
          type="text"
          placeholder="Search by Title, Key, Value, or Description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive mb-5">
          <table className="table table-bordered table-user">
            <thead>
              <tr>
                <th scope="col" style={{ width: "10%" }}>Sr No.</th>
                <th scope="col" style={{ width: "20%" }}>Title</th>
                {/* <th scope="col" style={{ width: "20%" }}>Key</th> */}
                <th scope="col" style={{ width: "25%" }}>Description</th>
                <th scope="col" style={{ width: "20%" }}>Value</th>
                <th scope="col" style={{ width: "10%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((setting, index) => (
                  <tr key={setting.config_id}>
                    <td>{index + 1}</td>
                    <td>{setting?.title || "N/A"}</td>
                    {/* <td>{setting.config_key}</td> */}
                    <td>{setting.description || "N/A"}</td>
                    <td>{setting.config_value}</td>
                    <td>
                      <EditIcon
                        onClick={() => handleEditClick(setting)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <EditSettingModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSave}
        selectedSetting={selectedSetting}
      />
    </div>
  );
};

export default SettingsTable;
