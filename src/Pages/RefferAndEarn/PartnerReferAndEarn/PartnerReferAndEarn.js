
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../../Reward/Reward.css";

const PartnerReferAndEarn = () => {
  const [formData, setFormData] = useState({
    refered_from_how_much_points_will_be_added_partner: "",
    refered_to_how_much_points_will_be_added_partner: "",
    refered_to_how_many_bookings_to_avail_points_partner: ""
  });

  const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/refer_and_earn`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        if (response.data.success && Array.isArray(response.data.data)) {
          const mappedData = {};
          response.data.data.forEach((config) => {
            mappedData[config.config_key] = config.config_value;
          });
          setFormData(mappedData);
        }
      })
      .catch((error) => {
        toast.error("Error fetching reward config!");
        console.error("Error fetching reward config:", error);
      });
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (key) => {
    const payload = {
      key,
      value: formData[key].toString()
    };

    try {
      await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/refer_and_earn`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Reward configuration updated successfully!");
    } catch (error) {
      toast.error("Error updating reward config!");
      console.error("Error updating reward config:", error);
    }
  };

  return (
    <div className="MainDining_AddTable mb-5 mt-5">
      <form className="menu-container" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div className="Reward-form-background">
          <label className="Label-Reward-form-background">
            Referred from how much points will be added for partner?
          </label>
          <div className="reward-alignments-btn">
            <input
              className="input-Reward-form-background"
              type="number"
              name="refered_from_how_much_points_will_be_added_partner"
              value={formData.refered_from_how_much_points_will_be_added_partner}
              onChange={handleChange}
              placeholder="Enter points"
            />
            <button type="button" className="Reward-button" onClick={() => handleUpdate("refered_from_how_much_points_will_be_added_partner")}> 
              Update
            </button>
          </div>
        </div>

        <div className="Reward-form-background">
          <label className="Label-Reward-form-background">
            Referred to how much points will be added for partner?
          </label>
          <div className="reward-alignments-btn">
            <input
              className="input-Reward-form-background"
              type="number"
              name="refered_to_how_much_points_will_be_added_partner"
              value={formData.refered_to_how_much_points_will_be_added_partner}
              onChange={handleChange}
              placeholder="Enter points"
            />
            <button type="button" className="Reward-button" onClick={() => handleUpdate("refered_to_how_much_points_will_be_added_partner")}> 
              Update
            </button>
          </div>
        </div>

        <div className="Reward-form-background">
          <label className="Label-Reward-form-background">
            Referred to how many bookings to avail points for partner?
          </label>
          <div className="reward-alignments-btn">
            <input
              className="input-Reward-form-background"
              type="number"
              name="refered_to_how_many_bookings_to_avail_points_partner"
              value={formData.refered_to_how_many_bookings_to_avail_points_partner}
              onChange={handleChange}
              placeholder="Enter number of bookings"
            />
            <button type="button" className="Reward-button" onClick={() => handleUpdate("refered_to_how_many_bookings_to_avail_points_partner")}> 
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PartnerReferAndEarn;