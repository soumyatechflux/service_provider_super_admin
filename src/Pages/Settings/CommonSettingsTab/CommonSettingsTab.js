import React, { useState } from "react";
import "./CommonSettingsTab.css";

const CommonSettingsTab = () => {
  const [settings, setSettings] = useState({
    minOrder: 1,
    maxOrder: 5,
    maxCancelByCustomer: 3,
    maxCancelByPartner: 3,
    orderTimeout: 30,
    serviceAreaRadius: 15,
    minPartnerRating: 4.5,
    maxConcurrentOrders: 5,
    cancellationFee: 10,
    minBookingDays: 2,
    partnerVerificationRequired: true,
    maxServiceDistance: 20,
    partnerWorkingHoursStart: "09:00",
    partnerWorkingHoursEnd: "18:00",
    reviewRequired: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can send the settings to your backend here
    console.log("Settings saved:", settings);
  };

  return (
    <div className="settings-page">
        <h2>Settings</h2>
      {/* <h2>Admin Settings</h2> */}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group form-group-settings">
            <label htmlFor="minOrder">Minimum Orders for a Partner</label>
            <input
              type="number"
              id="minOrder"
              name="minOrder"
              value={settings.minOrder}
              onChange={handleChange}
            />
          </div>

          <div className="form-group form-group-settings">
            <label htmlFor="maxOrder">Maximum Orders for a Partner</label>
            <input
              type="number"
              id="maxOrder"
              name="maxOrder"
              value={settings.maxOrder}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group form-group-settings">
            <label htmlFor="maxCancelByCustomer">
              Maximum Cancellations by Customer
            </label>
            <input
              type="number"
              id="maxCancelByCustomer"
              name="maxCancelByCustomer"
              value={settings.maxCancelByCustomer}
              onChange={handleChange}
            />
          </div>

          <div className="form-group form-group-settings">
            <label htmlFor="maxCancelByPartner">
              Maximum Cancellations by Partner
            </label>
            <input
              type="number"
              id="maxCancelByPartner"
              name="maxCancelByPartner"
              value={settings.maxCancelByPartner}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group form-group-settings">
            <label htmlFor="orderTimeout">Order Timeout (Minutes)</label>
            <input
              type="number"
              id="orderTimeout"
              name="orderTimeout"
              value={settings.orderTimeout}
              onChange={handleChange}
            />
          </div>

          <div className="form-group form-group-settings ">
            <label htmlFor="serviceAreaRadius">Service Area Radius (km)</label>
            <input
              type="number"
              id="serviceAreaRadius"
              name="serviceAreaRadius"
              value={settings.serviceAreaRadius}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group form-group-settings">
            <label htmlFor="minPartnerRating">Minimum Partner Rating</label>
            <input
              type="number"
              id="minPartnerRating"
              name="minPartnerRating"
              value={settings.minPartnerRating}
              onChange={handleChange}
              step="0.1"
              min="1"
              max="5"
            />
          </div>

          <div className="form-group form-group-settings">
            <label htmlFor="maxConcurrentOrders">Max Concurrent Orders</label>
            <input
              type="number"
              id="maxConcurrentOrders"
              name="maxConcurrentOrders"
              value={settings.maxConcurrentOrders}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group form-group-settings">
            <label htmlFor="cancellationFee">
              Cancellation Fee (in currency)
            </label>
            <input
              type="number"
              id="cancellationFee"
              name="cancellationFee"
              value={settings.cancellationFee}
              onChange={handleChange}
            />
          </div>

          <div className="form-group form-group-settings">
            <label htmlFor="minBookingDays">Minimum Days for Booking Ahead</label>
            <input
              type="number"
              id="minBookingDays"
              name="minBookingDays"
              value={settings.minBookingDays}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group form-group-settings">
            <label htmlFor="maxServiceDistance">
              Max Distance for Service (km)
            </label>
            <input
              type="number"
              id="maxServiceDistance"
              name="maxServiceDistance"
              value={settings.maxServiceDistance}
              onChange={handleChange}
            />
          </div>

          {/* <div className="form-group form-group-settings">
            <label htmlFor="partnerWorkingHoursStart">
              Partner Working Hours Start
            </label>
            <input
              type="time"
              id="partnerWorkingHoursStart"
              name="partnerWorkingHoursStart"
              value={settings.partnerWorkingHoursStart}
              onChange={handleChange}
            />
          </div> */}
        </div>

        {/* <div className="form-row">
          <div className="form-group form-group-settings">
            <label htmlFor="partnerWorkingHoursEnd">
              Partner Working Hours End
            </label>
            <input
              type="time"
              id="partnerWorkingHoursEnd"
              name="partnerWorkingHoursEnd"
              value={settings.partnerWorkingHoursEnd}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reviewRequired">
              Require Customer Review After Service
            </label>
            <input
              type="checkbox"
              id="reviewRequired"
              name="reviewRequired"
              checked={settings.reviewRequired}
              onChange={(e) =>
                setSettings({ ...settings, reviewRequired: e.target.checked })
              }
            />
          </div>
        </div> */}

        <div className=" save-btn-div">
          <button type="submit" className="Discount-btn">Save Settings</button>
        </div>
      </form>
    </div>
  );
};

export default CommonSettingsTab;
