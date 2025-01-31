
import React, { useState } from "react";
import "./VerifyDriver.css";

const VerifyDriver = () => {
  const [driverDetails, setDriverDetails] = useState({
    name: "John Doe",
    phone: "9876543210",
    email: "johndoe@example.com",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [aadhar, setAadhar] = useState("");
  const [carType, setCarType] = useState("");
  const [tripPreferred, setTripPreferred] = useState("");
  const [drivingLicence, setDrivingLicence] = useState(""); // State for Driving Licence
  const [expiryDate, setExpiryDate] = useState(""); // State for Expiry Date
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (
      !driverDetails.name ||
      !driverDetails.phone ||
      !aadhar ||
      !carType ||
      !tripPreferred ||
      !drivingLicence ||
      !expiryDate
    ) {
      setError("All fields are required!");
      return;
    }

    if (!/^\d{12}$/.test(aadhar)) {
      setError("Aadhar card number must be a valid 12-digit number.");
      return;
    }

    setError("");
    alert("Verification successful!");
    console.log({
      driverDetails,
      profilePhoto,
      carType,
      tripPreferred,
      aadhar,
      drivingLicence,
      expiryDate,
    });
  };

  return (
    <div className="verification-container">
      <h2>Driver Verification</h2>

      {/* Profile Section */}
      <div className="profile-content">
        <div className="avatar-section">
          <div className="avatar">
            <span>{driverDetails.name[0]}</span>
          </div>
        </div>

        {/* Details Section */}
        <div className="details-section">
          <label>Full Name</label>
          <div className="detail-item">
            <div className="detail-value">
              <span>{driverDetails.name}</span>
            </div>
          </div>

          <label>Mobile Number</label>
          <div className="detail-item">
            <div className="detail-value">
              <span>{driverDetails.phone}</span>
            </div>
          </div>

          <label>Email</label>
          <div className="detail-item">
            <div className="detail-value">
              <span>{driverDetails.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Driving Licence Section */}
      <div className="form-group mt-4">
        <label>Driving Licence</label>
        <input
          type="text"
          value={drivingLicence}
          onChange={(e) => setDrivingLicence(e.target.value)}
          placeholder="Enter Licence Number"
        />
      </div>

      {/* Expiry Date Section */}
      <div className="form-group">
        <label>Expiry Date</label>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          placeholder="Enter Expiry Date"
        />
      </div>
      {/* Dropdown Sections */}
      <div className="form-group">
        <label>Car Type</label>
        <select value={carType} onChange={(e) => setCarType(e.target.value)}>
          <option value="" disabled>
          Select Car Type
          </option>
          <option value="rent">Rent</option>
          <option value="own">Own</option>
        </select>
      </div>

      <div className="form-group">
        <label>Trip Preferred</label>
        <select
          value={tripPreferred}
          onChange={(e) => setTripPreferred(e.target.value)}
        >
          <option value="" disabled>
            Select Trip Preferred
          </option>
          <option value="short">Short</option>
          <option value="long">Long</option>
        </select>
      </div>

      {/* Aadhar Card Section */}
      <div className="form-group">
        <label>Aadhar Card Number</label>
        <input
          type="text"
          value={aadhar}
          onChange={(e) => setAadhar(e.target.value)}
          placeholder="Enter Aadhar card number"
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      {/* Verify Button */}
      <button onClick={handleSubmit} className="verify-button">
        Verify
      </button>
    </div>
  );
};

export default VerifyDriver;
