
// import React, { useState } from "react";
// import "./VerifyChef.css";
// import { Pen, Pencil } from "react-bootstrap-icons";
// import { ReportGmailerrorred } from "@mui/icons-material";

// const VerifyChef = () => {
//   const [cookDetails, setCookDetails] = useState({
//     name: "John Doe",
//     phone: "9876543210",
//     address: "123, Main Street, New Delhi",
//     email: "abc@gmail.com",
//   });
//   const [specializations, setSpecializations] = useState([]);
//   const [newSpecialization, setNewSpecialization] = useState("");
//   const [profilePhoto, setProfilePhoto] = useState(null);
//   const [aadhar, setAadhar] = useState("");
//   const [experience, setExperience] = useState("");
//   const [error, setError] = useState("");

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCookDetails({ ...cookDetails, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     setProfilePhoto(e.target.files[0]);
//   };

//   const handleAddSpecialization = () => {
//     if (
//       newSpecialization.trim() &&
//       !specializations.includes(newSpecialization)
//     ) {
//       setSpecializations([...specializations, newSpecialization]);
//       setNewSpecialization("");
//     }
//   };

//   const handleRemoveSpecialization = (specialization) => {
//     setSpecializations(
//       specializations.filter((item) => item !== specialization)
//     );
//   };

//   const handleSubmit = () => {
//     if (!cookDetails.name || !cookDetails.phone || !aadhar || !experience) {
//       setError("All fields are required!");
//       return;
//     }

//     if (!/^\d{12}$/.test(aadhar)) {
//       setError("Aadhar card number must be a valid 12-digit number.");
//       return;
//     }

//     setError("");
//     alert("Verification successful!");
//     console.log({
//       cookDetails,
//       profilePhoto,
//       specializations,
//       experience,
//       aadhar,
//     });
//   };

//   return (
//     <div className="verification-container">
//       <h2>Cook Verification</h2>
//       {/* Avatar Section */}
//       <div className="profile-content">
//         <div className="avatar-section">
//           <div className="avatar">
//             <span>{cookDetails.name[0]}</span>
//           </div>
//         </div>

//         {/* Details Section */}
//         <div className="details-section">
//           <label>Full Name</label>
//           <div className="detail-item">
//             <div className="detail-value">
//               <span>{cookDetails.name}</span>
//             </div>
//           </div>

//           <label>Mobile Number</label>
//           <div className="detail-item">
//             <div className="detail-value">
//               <span>{cookDetails.phone}</span>
//             </div>
//           </div>

//           <label>Email</label>
//           <div className="detail-item">
//             <div className="detail-value">
//               <span>{cookDetails.email}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Specialization Section */}
//       <div className="specialization section form-group mt-4">
//         <label>Specializations</label>
//         <div className="specializations">
//           {specializations.map((item, index) => (
//             <span key={index} className="specialization-tag">
//               {item}
//               <button onClick={() => handleRemoveSpecialization(item)}>
//                 ×
//               </button>
//             </span>
//           ))}
//         </div>
//         <input
//           type="text"
//           value={newSpecialization}
//           onChange={(e) => setNewSpecialization(e.target.value)}
//           placeholder="Add a specialization"
//         />
//         <button onClick={handleAddSpecialization}>Add</button>
//       </div>

//       {/* Experience Section */}
//       <div className="form-group">
//         <label>Years of Experience</label>
//         <input
//           type="number"
//           value={experience}
//           onChange={(e) => setExperience(e.target.value)}
//           placeholder="Enter years of experience"
//         />
//       </div>

//       {/* Aadhar Card Section */}
//       <div className="form-group">
//         <label>Aadhar Card Number</label>
//         <input
//           type="text"
//           value={aadhar}
//           onChange={(e) => setAadhar(e.target.value)}
//           placeholder="Enter Aadhar card number"
//         />
//       </div>

//       {error && <p className="error-message">{error}</p>}

//       {/* Verify Button */}
//       <button onClick={handleSubmit} className="verify-button">
//         Verify
//       </button>
//     </div>
//   );
// };

// export default VerifyChef;