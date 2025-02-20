import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./VerifyChef.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import CreatableSelect from "react-select/creatable";

// Move cuisineOptions outside components so it can be shared
const defaultCuisineOptions = [
  { value: "north_indian", label: "North Indian" },
  { value: "south_indian", label: "South Indian" },
  { value: "chinese", label: "Chinese" },
  { value: "italian", label: "Italian" },
  { value: "mexican", label: "Mexican" },
  { value: "thai", label: "Thai" },
  { value: "japanese", label: "Japanese" },
  { value: "continental", label: "Continental" },
];

const CuisineSelect = ({ value, onChange }) => {
  const [customCuisines, setCustomCuisines] = useState([]);
  
  const cuisineOptions = [...defaultCuisineOptions, ...customCuisines];

  const handleChange = (selectedOptions) => {
    onChange(selectedOptions || []);
  };

  const handleCreateOption = (inputValue) => {
    const newOption = { value: inputValue.toLowerCase(), label: inputValue };
    setCustomCuisines(prev => [...prev, newOption]);
    
    const newValue = value ? [...value, newOption] : [newOption];
    onChange(newValue);
  };

  return (
    <CreatableSelect
      isMulti
      name="cuisines"
      options={cuisineOptions}
      value={value}
      onChange={handleChange}
      onCreateOption={handleCreateOption}
      placeholder="Select or type custom cuisine"
      formatCreateLabel={(inputValue) => `Add "${inputValue}" as custom cuisine`}
      required
    />
  );
};

const VerifyChef = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null); // Add this state to track which button is loading
  const { restaurant, id, isVerify } = location.state || {};
  const [partnerDetails, setPartnerDetails] = useState([]);
  const navigate = useNavigate();
  const [attachments, setAttachments] = useState([]);


  // Convert cuisine array to array of objects for the select component
  const [cookDetails, setCookDetails] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    whatsapp: "",
    aadhaar: "",
    dob: "",
    address: "",
    permanentAddress: "",
    experience: "",
    category: "",
    subCategory: "",
    dateOfJoining: "",
    languages: "",
    drivingLicenseNumber: "",
    licenseExpiryDate: "",
    carType: "",
    transmissionType: "",
    vegNonVeg: "",
    aadharFront: null,
    aadharBack: null,
    panCard: null,
    bankDetails: null,
    drivingLicense: null,
    currentAddressProof: null,
    verificationReport: null,
    comment: "",
    registeredBy: "",
    cuisines: "" // Initialize as empty array
  });

  // Safely convert cuisine array to array of objects with error handling
  const selectedCuisineOptions = Array.isArray(cookDetails.cuisines) 
    ? cookDetails.cuisines.map(cuisine => {
        const existingOption = defaultCuisineOptions.find(opt => opt.value === cuisine);
        return existingOption || { value: cuisine, label: cuisine };
      })
    : [];

  // const handleInputChangeCar = (field, value) => {
  //   setCookDetails(prev => ({
  //     ...prev,
  //     [field]: Array.isArray(value) ? value.map(option => option.value) : []
  //   }));
  // };

  const handleInputChangeCategory = (name, value) => {
    setCookDetails((prevState) => ({
      ...prevState,
      [name]: value,
      ...(name === "category_id" && { subCategory: "" }),
    }));
  };

  const fetchPartnerDetails = async () => {
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
      setLoading(true);

      const response = await axios.get(
        "https://api-serviceprovider.techfluxsolutions.com/api/admin/partners",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            partner_id: id,
          },
        }
      );

      setLoading(false);

      if (response.status === 200 && response.data.success) {
        console.log("API Response:", response.data);

        const partnerData = response.data.data.find(
          (partner) => partner.id === parseInt(id)
        );

        if (partnerData) {
          console.log("Partner Data:", partnerData);

          // Dynamically map all attachments based on document_name
          const mappedAttachments = {};
          partnerData.attachments?.forEach((file) => {
            mappedAttachments[file.document_name] = file.file_path;
          });

          // Convert cuisines string to array if it exists
          let cuisinesArray = [];
          if (partnerData.cuisines) {
            // Handle both string and array formats
            if (typeof partnerData.cuisines === 'string') {
              cuisinesArray = partnerData.cuisines.split(',').map(cuisine => cuisine.trim());
            } else if (Array.isArray(partnerData.cuisines)) {
              cuisinesArray = partnerData.cuisines;
            }
          }

          // Convert cuisines array to format expected by Select component
          const formattedCuisines = cuisinesArray.map(cuisine => {
            // Try to find matching option from default options
            const existingOption = defaultCuisineOptions.find(opt => 
              opt.value.toLowerCase() === cuisine.toLowerCase() ||
              opt.label.toLowerCase() === cuisine.toLowerCase()
            );
            
            // If found, use existing option, otherwise create new one
            return existingOption || {
              value: cuisine.toLowerCase().replace(/\s+/g, '_'),
              label: cuisine.charAt(0).toUpperCase() + cuisine.slice(1)
            };
          });

          setCookDetails({
            name: partnerData.name || "",
            email: partnerData.email || "",
            phone: partnerData.mobile || "",
            dob: partnerData.dob || "",
            aadhaar: partnerData.aadhaar || "",
            address: partnerData.current_address || "",
            permanentAddress: partnerData.permanent_address || "",
            experience: partnerData.years_of_experience || "",
            subCategory: partnerData.specialisation || "",
            dateOfJoining: partnerData.date_of_joining || "",
            languages: partnerData.languages || "",
            drivingLicenseNumber: partnerData.driving_license_number || "",
            licenseExpiryDate: partnerData.driving_license_expiry_date || "",
            carType: partnerData.car_type || "",
            transmissionType: partnerData.transmission_type || "",
            cuisines: formattedCuisines, // Store as array of option objects
            vegNonVeg: partnerData.veg_non_veg || "",
            category_id: partnerData.category_id || "",
            account_holder_name: partnerData.account_holder_name || "",
            account_number: partnerData.account_number || "",
            ifsc_code: partnerData.ifsc_code || "",
            bank_name: partnerData.bank_name || "",
            whatsapp_no: partnerData.whatsapp_no || "",
            gender: partnerData.gender
              ? partnerData.gender.charAt(0).toUpperCase() +
                partnerData.gender.slice(1)
              : "",
            comment: partnerData.comment || "",
            registeredBy: partnerData.registered_by_id || "",
            ...mappedAttachments,
          });

          setAttachments(partnerData.attachments || []);
        } else {
          toast.error("Partner not found");
        }
      } else {
        toast.error(response.data.message || "Failed to fetch partner details");
      }
    } catch (error) {
      console.error("Error fetching partner details:", error);
      toast.error("Failed to fetch partner details. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPartnerDetails();
    }
  }, [id]);

  const handleInputChangeCar = (field, value) => {
    setCookDetails(prev => ({
      ...prev,
      [field]: Array.isArray(value) ? value.map(option => option.value) : value
    }));
  };
  useEffect(() => {
    console.log("Updated cookDetails:", cookDetails);
  }, [cookDetails]);

  // Call the fetch function when component mounts
  useEffect(() => {
    if (id) {
      fetchPartnerDetails();
    }
  }, [id]);

  const getVerifyDetails = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );

      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/partners/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);

      if (response?.status === 200 && response?.data?.success === true) {
        const data = response?.data?.data || [];
        console.log("test => ", data?.name);
        setPartnerDetails(data);
        console.log("MINE", partnerDetails);
        // setRestaurants(data);
      } else {
        toast.error(response.data.message || "Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching partners data:", error);
      // toast.error("Failed to load partners data. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getVerifyDetails();
  }, []);

  const carOptions = [
    { value: "hatchback", label: "Hatchback" },
    { value: "sedan", label: "Sedan" },
    { value: "suv", label: "SUV" },
    { value: "luxury", label: "Luxury" },
  ];

  const transmissionOptions = [
    { value: "automatic", label: "Automatic" },
    { value: "manual", label: "Manual" },
  ];

  const [error, setError] = useState("");
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    setCookDetails((prevDetails) => ({
      ...prevDetails,
      [name]: files && files.length > 0 ? files[0] : value,
    }));

    if (files && files.length > 0) {
      // Format the name consistently with how it's stored in the documents array
      const formattedName = name
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()
        .replace(/^_/, ""); // Remove leading underscore if present

      setAttachments((prevAttachments) => {
        const existingAttachment = prevAttachments.find(
          (attachment) => attachment.document_name === formattedName
        );

        if (existingAttachment) {
          return prevAttachments.map((attachment) =>
            attachment.document_name === formattedName
              ? {
                  ...attachment,
                  file_name: files[0].name,
                  file_path: URL.createObjectURL(files[0]),
                }
              : attachment
          );
        } else {
          return [
            ...prevAttachments,
            {
              document_name: formattedName,
              file_name: files[0].name,
              file_path: URL.createObjectURL(files[0]),
            },
          ];
        }
      });
    }
  };

  const verificationHeadings = {
    1: "Cook Verification",
    2: "Driver Verification",
    3: "Gardener Verification",
  };

  const categoryOptions = [
    { value: "1", label: "Cook" },
    { value: "2", label: "Driver" },
    { value: "3", label: "Gardener" },
  ];

  const specializationOptions = {
    1: [
      { value: "cook_one_meal", label: "Cook for One Meal" },
      { value: "cook_one_day", label: "Cook for One Day" },
      { value: "chef_party", label: "Chef for Party" },
    ],
    2: [
      { value: "round_trip", label: "Round Trip" },
      { value: "one_way_trip", label: "One Way Trip" },
      { value: "one_day_ride", label: "One Day Ride" },
      { value: "outstation_round_trip", label: "Outstation Round Trip" },
    ],
    3: [
      { value: "one_time_visit", label: "One Time Visit" },
      { value: "monthly_subscription", label: "Monthly Subscription" },
    ],
  };

  // const cuisineOptions = [
  //   { value: "north_indian", label: "North Indian" },
  //   { value: "south_indian", label: "South Indian" },
  //   { value: "chinese", label: "Chinese" },
  //   { value: "italian", label: "Italian" },
  //   { value: "mexican", label: "Mexican" },
  //   { value: "thai", label: "Thai" },
  //   { value: "japanese", label: "Japanese" },
  //   { value: "continental", label: "Continental" },
  // ];

  const vegNonVegOptions = [
    { value: "Veg", label: "Veg" },
    { value: "Non-Veg", label: "Non-Veg" },
  ];
  const heading = verificationHeadings[restaurant] || "Default Verification";

  const handlePartnerDetails = async (action) => {
    // Only validate required fields for verify action
    if (action === "verify") {
      const requiredFields = [
        "dob",
        "email",
        // "aadhaar",
        "address",
        "permanentAddress",
        "experience",
        "subCategory",
        "dateOfJoining",
        "languages",
        // "aadharFront",
        // "aadharBack",
        // "panCard",
        // "bankDetails",
        // "verifyReport",
        // "registeredBy"
      ];

      // Validate that no required field is missing
      const missingFields = requiredFields.filter((field) => !cookDetails[field]);
      if (missingFields.length > 0) {
        toast.error(
          `Please fill all required fields: ${missingFields.join(", ")}`
        );
        return;
      }

      if (restaurant === 2 && !cookDetails.drivingLicense) {
        toast.error("Please upload the Driving License Photocopy.");
        return;
      }
    }

    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
      const formData = new FormData();

      // Append basic fields
      if (cookDetails.name) formData.append("name", cookDetails.name);
      if (cookDetails.email) formData.append("email", cookDetails.email);
      if (cookDetails.phone) formData.append("mobile", cookDetails.phone);
      if (cookDetails.gender) formData.append("gender", cookDetails.gender);
      if (cookDetails.comment) formData.append("comment", cookDetails.comment);

      // Handle cuisines
      if (cookDetails.cuisines) {
        const cuisinesString = Array.isArray(cookDetails.cuisines) 
          ? cookDetails.cuisines.map(cuisine => 
              typeof cuisine === 'string' ? cuisine : cuisine.value
            ).join(',')
          : cookDetails.cuisines;
        formData.append("cuisines", cuisinesString);
      }

      // Format dates
      if (cookDetails.dob) {
        const formattedDOB = new Date(cookDetails.dob)
          .toISOString()
          .split("T")[0];
        formData.append("dob", formattedDOB);
      }

      if (cookDetails.licenseExpiryDate) {
        const formattedDate = new Date(cookDetails.licenseExpiryDate)
          .toISOString()
          .split("T")[0];
        formData.append("driving_license_expiry_date", formattedDate);
      }

      // Append other fields
      if (cookDetails.aadhaar) formData.append("aadhaar", cookDetails.aadhaar);
      if (cookDetails.address) formData.append("current_address", cookDetails.address);
      if (cookDetails.permanentAddress) formData.append("permanent_address", cookDetails.permanentAddress);
      if (cookDetails.experience) formData.append("years_of_experience", cookDetails.experience);
      if (cookDetails.subCategory) formData.append("specialisation", cookDetails.subCategory);
      
      if (cookDetails.dateOfJoining) {
        const formattedDateOfJoining = new Date(cookDetails.dateOfJoining)
          .toISOString()
          .split("T")[0];
        formData.append("date_of_joining", formattedDateOfJoining);
      }

      // Append remaining fields
      if (cookDetails.languages) formData.append("languages", cookDetails.languages);
      if (cookDetails.drivingLicenseNumber) formData.append("driving_license_number", cookDetails.drivingLicenseNumber);
      if (cookDetails.carType) formData.append("car_type", cookDetails.carType);
      if (cookDetails.transmissionType) formData.append("transmission_type", cookDetails.transmissionType);
      if (cookDetails.vegNonVeg) formData.append("veg_non_veg", cookDetails.vegNonVeg);
      if (cookDetails.category_id) formData.append("category_id", cookDetails.category_id);
      
      // Append bank details
      if (cookDetails.account_holder_name) formData.append("account_holder_name", cookDetails.account_holder_name);
      if (cookDetails.account_number) formData.append("account_number", cookDetails.account_number);
      if (cookDetails.ifsc_code) formData.append("ifsc_code", cookDetails.ifsc_code);
      if (cookDetails.bank_name) formData.append("bank_name", cookDetails.bank_name);
      if (cookDetails.whatsapp_no) formData.append("whatsapp_no", cookDetails.whatsapp_no);

      // Append files
      if (cookDetails.aadharFront) formData.append("aadhar_front", cookDetails.aadharFront);
      if (cookDetails.aadharBack) formData.append("aadhar_back", cookDetails.aadharBack);
      if (cookDetails.panCard) formData.append("pancard", cookDetails.panCard);
      if (cookDetails.bankDetails) formData.append("bank_passbook", cookDetails.bankDetails);
      if (cookDetails.drivingLicense) formData.append("driving_licence", cookDetails.drivingLicense);
      if (cookDetails.currentAddressProof) formData.append("address_proof", cookDetails.currentAddressProof);
      if (cookDetails.verificationReport) formData.append("verification_report", cookDetails.verificationReport);

      // Always append these fields
      formData.append("partner_id", id);
      formData.append("save_or_verify", action);

      if (action === "verify") {
        formData.append("is_verify", isVerify);
      }

      setLoading(true);
      setLoadingAction(action);

      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/partners/verify`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);
      setLoadingAction(null);

      if (response.status === 200 && response.data.success) {
        toast.success(
          action === "verify"
            ? "Partner verified successfully!"
            : "Partner details saved successfully!"
        );
        navigate("/partners");
      } else {
        toast.error(
          response.data.message ||
            `${action === "verify" ? "Verification" : "Saving"} failed.`
        );
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      toast.error(`Failed to ${action} partner. Please try again.`);
      setLoading(false);
      setLoadingAction(null);
    }
  };
  return (
    <div className="verification-container">
      <h2>{heading}</h2>

      {/* Basic Fields */}

      <div className="profile-content">
        <div className="avatar-section">
          <div className="avatar">
            <span>{partnerDetails?.name?.charAt(0).toUpperCase()}</span>
          </div>
        </div>

        <div className="details-section">
          <label>
            Full Name <span style={{ color: "red" }}>*</span>
          </label>

          <input
            type="text"
            name="name"
            value={partnerDetails?.name}
            onChange={handleInputChange}
            placeholder="Enter full name"
          />

          <label>
            Mobile Number <span style={{ color: "red" }}>*</span>
          </label>

          <input
            type="text"
            name="phone"
            value={partnerDetails?.mobile}
            onChange={handleInputChange}
            placeholder="Enter mobile number"
          />

          <label>
            WhatsApp Number<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="whatsapp_no"
            value={cookDetails?.whatsapp_no}
            onChange={handleInputChange}
            placeholder="Enter WhatsApp Number"
            required
          />

          <label>
            Email <span style={{ color: "red" }}>*</span>
          </label>

          <input
            type="text"
            name="email"
            value={cookDetails.email}
            onChange={handleInputChange}
            placeholder="Enter email"
          />
        </div>
      </div>

      {/* Additional Fields Based on ID */}

      {restaurant === 1 && (
        <>
         <label>
            Cuisines <span style={{ color: "red" }}>*</span>
          </label>
          <CuisineSelect
            value={cookDetails.cuisines}
            onChange={(selectedOptions) => {
              setCookDetails(prev => ({
                ...prev,
                cuisines: selectedOptions
              }));
            }}
          />

          <label>
            Veg / Non-Veg <span style={{ color: "red" }}>*</span>
          </label>
          <Select
            isMulti
            name="vegNonVeg"
            options={vegNonVegOptions}
            value={vegNonVegOptions.filter((option) =>
              cookDetails.vegNonVeg.includes(option.value)
            )}
            onChange={(selectedOptions) =>
              handleInputChangeCar("vegNonVeg", selectedOptions)
            }
            required
            placeholder="Select Veg / Non-Veg"
          />
        </>
      )}

      {restaurant === 2 && (
        <>
          <label>
            Driving License Number <span style={{ color: "red" }}>*</span>
          </label>

          <input
            type="text"
            name="drivingLicenseNumber"
            value={cookDetails?.drivingLicenseNumber}
            onChange={handleInputChange}
            placeholder="Enter driving license number"
            required
          />

          <label>
            License Expiry Date <span style={{ color: "red" }}>*</span>
          </label>

          <input
            type="date"
            name="licenseExpiryDate"
            value={
              cookDetails?.licenseExpiryDate
                ? new Date(cookDetails.licenseExpiryDate)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={handleInputChange}
            required
          />

          <label>
            Car Type <span style={{ color: "red" }}>*</span>
          </label>
          <Select
            isMulti
            name="carType"
            options={carOptions}
            value={carOptions.filter((option) =>
              cookDetails.carType.includes(option.value)
            )}
            onChange={(selectedOptions) =>
              handleInputChangeCar("carType", selectedOptions)
            }
            required
          />

          <label>
            Transmission Type <span style={{ color: "red" }}>*</span>
          </label>
          <Select
            isMulti
            name="transmissionType"
            options={transmissionOptions}
            value={transmissionOptions.filter((option) =>
              cookDetails.transmissionType.includes(option.value)
            )}
            onChange={(selectedOptions) =>
              handleInputChangeCar("transmissionType", selectedOptions)
            }
            required
          />
        </>
      )}

      {/* Common Fields */}
      <label>
        Date of Birth <span style={{ color: "red" }}>*</span>
      </label>

      <input
        type="date"
        name="dob"
        value={
          cookDetails?.dob
            ? new Date(cookDetails.dob).toISOString().split("T")[0]
            : ""
        }
        onChange={handleInputChange}
        placeholder="Enter Date of Birth"
        required
      />

      <div className="additional-details mt-2">
        <label>
          Gender <span style={{ color: "red" }}>*</span>
        </label>

        <select
          name="gender"
          value={cookDetails?.gender}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label>
          Aadhar Card Number <span style={{ color: "red" }}>*</span>
        </label>

        <input
          type="text"
          name="aadhaar"
          value={cookDetails?.aadhaar}
          onChange={handleInputChange}
          placeholder="Enter Aadhar card number"
          required
        />

        <label>
          Current Address <span style={{ color: "red" }}>*</span>
        </label>

        <input
          type="text"
          name="address"
          value={cookDetails.address}
          onChange={handleInputChange}
          placeholder="Enter current address"
          required
        />

        <label>
          Permanent Address <span style={{ color: "red" }}>*</span>
        </label>

        <input
          type="text"
          name="permanentAddress"
          value={cookDetails.permanentAddress}
          onChange={handleInputChange}
          placeholder="Enter permanent address"
          required
        />

        <label>
          Years of Experience <span style={{ color: "red" }}>*</span>
        </label>

        <input
          type="number"
          name="experience"
          value={cookDetails?.experience}
          onChange={handleInputChange}
          placeholder="Enter years of experience"
          required
        />
        <label>
          Category <span style={{ color: "red" }}>*</span>
        </label>
        <select
          name="category_id" // Updated to category_id
          value={cookDetails.category_id}
          onChange={(e) =>
            handleInputChangeCategory("category_id", e.target.value)
          }
          required
        >
          <option value="">Select Category</option>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Specialization Dropdown (Dynamic Based on Category) */}
        <label>
          Specialization / Sub Category <span style={{ color: "red" }}>*</span>
        </label>
        <Select
          isMulti // Enables multiple selections
          name="subCategory"
          value={
            specializationOptions[cookDetails.category_id]?.filter((option) =>
              cookDetails.subCategory.includes(option.value)
            ) || []
          }
          onChange={(selectedOptions) =>
            handleInputChangeCategory(
              "subCategory",
              selectedOptions.map((option) => option.value)
            )
          }
          options={specializationOptions[cookDetails.category_id] || []}
          isDisabled={!cookDetails.category_id} // Disable if no category selected
          placeholder="Select Specialization / Sub Category"
        />

        <label>
          Date of Joining <span style={{ color: "red" }}>*</span>
        </label>

        <input
          type="date"
          name="dateOfJoining"
          value={
            cookDetails?.dateOfJoining
              ? new Date(cookDetails.dateOfJoining).toISOString().split("T")[0]
              : ""
          }
          onChange={handleInputChange}
          required
        />

        <label>
          Languages <span style={{ color: "red" }}>*</span>
        </label>

        <input
          type="text"
          name="languages"
          value={cookDetails?.languages}
          onChange={handleInputChange}
          placeholder="Enter languages (comma-separated)"
          required
        />

        <label>Comment(if any)</label>

        <input
          type="text"
          name="comment"
          value={cookDetails?.comment}
          onChange={handleInputChange}
          placeholder="Enter Comment "
          required
        />
      </div>
      <h2 className="mt-2">Bank Details</h2>

      <label>
        Account Holder Name <span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        name="account_holder_name"
        value={cookDetails?.account_holder_name}
        onChange={handleInputChange}
        placeholder="Enter Account Holder Name"
        required
      />

      <label>
        Bank Name <span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        name="bank_name"
        value={cookDetails?.bank_name}
        onChange={handleInputChange}
        placeholder="Enter Bank Name"
        required
      />

      <label>
        Account Number <span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        name="account_number"
        value={cookDetails?.account_number}
        onChange={handleInputChange}
        placeholder="Enter Account Number"
        required
      />

      <label>
        IFSC Code <span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        name="ifsc_code"
        value={cookDetails?.ifsc_code}
        onChange={handleInputChange}
        placeholder="Enter IFSC Code"
        required
      />

      {error && <p className="error-message">{error}</p>}

      <div className="document-section">
        <h2 className="mt-2">Documents</h2>

        {[
          {
            label: "Bank Details Photocopy",
            key: "bank_passbook",
            stateKey: "bankDetails",
          },
          {
            label: "Aadhaar Card Photocopy Front",
            key: "aadhar_front",
            stateKey: "aadharFront",
          },
          {
            label: "Aadhaar Card Photocopy Back",
            key: "aadhar_back",
            stateKey: "aadharBack",
          },
          { label: "PAN Card Photocopy", key: "pancard", stateKey: "panCard" },
          {
            label: "Driving License Photocopy",
            key: "driving_licence",
            stateKey: "drivingLicense",
          },
          {
            label: "Photocopy of Proof of Current Address",
            key: "address_proof",
            stateKey: "currentAddressProof",
          },
          {
            label: "Verification Report",
            key: "verification_report",
            stateKey: "verificationReport",
          },
        ].map(({ label, key, stateKey }) => (
          <div className="file-input-group" key={key}>
            <label htmlFor={stateKey}>{label}</label>
            <div className="file-input-wrapper">
              {attachments?.find(
                (attachment) => attachment.document_name === key
              ) && (
                <div>
                  <a
                    href={
                      attachments.find(
                        (attachment) => attachment.document_name === key
                      ).file_path
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Uploaded File
                  </a>
                </div>
              )}
              <div className="file-input-container">
                <button
                  type="button"
                  className="choose-file-btn mb-0"
                  onClick={() => document.getElementById(stateKey).click()}
                >
                  Choose File
                </button>
                <span className="file-name">
                  {attachments?.find(
                    (attachment) =>
                      attachment.document_name === key || // Check for exact match
                      attachment.document_name ===
                        stateKey
                          .replace(/([A-Z])/g, "_$1")
                          .toLowerCase()
                          .replace(/^_/, "") // Check for formatted match
                  )?.file_name || "No file chosen"}
                </span>
                <input
                  type="file"
                  id={stateKey}
                  name={stateKey}
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleInputChange}
                  required={key === "driving_licence" ? restaurant === 2 : true}
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Verify Button */}
      <div className="button-aliangment">
        <button
          onClick={() => handlePartnerDetails("save")}
          className="verify-button"
          disabled={loadingAction !== null} // Disable both buttons while either is loading
          style={{ width: "40%" }}
        >
          {loadingAction === "save" ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => handlePartnerDetails("verify")}
          className="verify-button"
          disabled={loadingAction !== null} // Disable both buttons while either is loading
          style={{ width: "40%" }}
        >
          {loadingAction === "verify" ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
};

export default VerifyChef;
