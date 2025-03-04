import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../Reward.css";

const PartnerReward = () => {
  const [formData, setFormData] = useState({
    after_how_many_bookings_completed_rewards_will_be_able_to_use_for_signup_partner: "",
    minimum_amount_of_booking_to_use_reward_points_partner: "",
    how_much_reward_points_equal_to_1_rupees_partner: ""
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
          How much reward points equal to 1 rupees?
          </label>
          <div className="reward-alignments-btn">
            <input
              className="input-Reward-form-background"
              type="number"
              name="how_much_reward_points_equal_to_1_rupees_partner"
              value={formData.how_much_reward_points_equal_to_1_rupees_partner}
              onChange={handleChange}
              placeholder="Enter rupee value per point"
            />
            <button type="button" className="Reward-button" onClick={() => handleUpdate("how_much_reward_points_equal_to_1_rupees_partner")}>
              Update
            </button>
          </div>
        </div>
        
        <div className="Reward-form-background">
          <label className="Label-Reward-form-background">
            After how many bookings completed, rewards will be able to use for signup partner?
          </label>
          <div className="reward-alignments-btn">
            <input
              className="input-Reward-form-background"
              type="number"
              name="after_how_many_bookings_completed_rewards_will_be_able_to_use_for_signup_partner"
              value={formData.after_how_many_bookings_completed_rewards_will_be_able_to_use_for_signup_partner}
              onChange={handleChange}
              placeholder="Enter number of bookings"
            />
            <button type="button" className="Reward-button" onClick={() => handleUpdate("after_how_many_bookings_completed_rewards_will_be_able_to_use_for_signup_partner")}>
              Update
            </button>
          </div>
        </div>

        <div className="Reward-form-background">
          <label className="Label-Reward-form-background">
            Minimum amount of booking to use reward points for partner?
          </label>
          <div className="reward-alignments-btn">
            <input
              className="input-Reward-form-background"
              type="number"
              name="minimum_amount_of_booking_to_use_reward_points_partner"
              value={formData.minimum_amount_of_booking_to_use_reward_points_partner}
              onChange={handleChange}
              placeholder="Enter amount"
            />
            <button type="button" className="Reward-button" onClick={() => handleUpdate("minimum_amount_of_booking_to_use_reward_points_partner")}>
              Update
            </button>
          </div>
        </div>

        
      </form>
    </div>
  );
};

export default PartnerReward;