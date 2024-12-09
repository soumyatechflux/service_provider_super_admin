// import React from 'react'

// const VerifyGardener = () => {
//   return (
//     <div>VerifyGardener</div>
//   )
// }

// export default VerifyGardener


import React, { useState } from "react";
import "./VerifyGardener.css";
import { Pen, Pencil } from "react-bootstrap-icons";

const VerifyGardener = () => {
  const [gardenerDetails, setGardenerDetails] = useState({
    name: "John Doe",
    phone: "9876543210",
    email: "johndoe@example.com",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [aadhar, setAadhar] = useState("");
  const [carType, setCarType] = useState("");
  const [tripPreferred, setTripPreferred] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!gardenerDetails.name || !gardenerDetails.phone || !carType || !tripPreferred) {
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
      gardenerDetails,
      profilePhoto,
      carType,
      tripPreferred,
      aadhar,
    });
  };

  return (
    <div className="verification-container">
      <h2>Gardener Verification</h2>

      {/* Profile Section */}
      <div className="profile-content">
        <div className="avatar-section">
          <div className="avatar">
            <span>{gardenerDetails.name[0]}</span>
            
          </div>
        </div>

        {/* Details Section */}
        <div className="details-section">
            <label>Full Name</label>
          <div className="detail-item">
            <div className="detail-value">
              <span>{gardenerDetails.name}</span>
              
              
            </div>
          </div>

            <label>Mobile Number</label>
          <div className="detail-item">
            <div className="detail-value">
              <span>{gardenerDetails.phone}</span>
              
            </div>
          </div>

            <label>Email</label>
          <div className="detail-item">
            <div className="detail-value">
              <span>{gardenerDetails.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="form-group mt-4">
        <label>Years of Experience</label>
        <input
          type="number"
        //   value={experience}
        //   onChange={(e) => setExperience(e.target.value)}
          placeholder="Enter years of experience"
        />
      </div>
      {/* Dropdown Sections */}
      <div className="form-group">
        <label>Job Type</label>
        <select value={carType} onChange={(e) => setCarType(e.target.value)}>
          <option value="" disabled>
            Select Job Type
          </option>
          <option value="rent">Full Time</option>
          <option value="own">Part Time</option>
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

export default VerifyGardener;
