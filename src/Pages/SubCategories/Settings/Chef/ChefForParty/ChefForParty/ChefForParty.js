import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiMinus } from "react-icons/bi";
import { HiPlus } from "react-icons/hi";
import { HiPlusSmall } from "react-icons/hi2";
import { IoMdBackspace } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import ReactQuill from "react-quill"; // Import the ReactQuill component
import "react-quill/dist/quill.snow.css"; // Import the Quill styles
import { toast } from "react-toastify";
import FoodItemsEditModal from "../FoodItemsEditModal/FoodItemsEditModal";

const ChefForParty = () => {
  const [partnerTax, setPartnerTax] = useState(null);
  const [commission, setCommission] = useState(null);
  const [partnersPayPercentage, setPartnersPayPercentage] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [nightChargesStartAt, setNightChargesStartAt] = useState("");
  const [nightChargesEndAt, setNightChargesEndAt] = useState(""); // New Field
  const [bookBefore, setBookBefore] = useState(1);
  const [cancellationBefore, setCancellationBefore] = useState(1);
  const [guestRows, setGuestRows] = useState([ { id: 0, count: 1, duration: "", price: "" }, ]);
  const [summary, setSummary] = useState("");
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [bookingSummaryPage, setBookingSummaryPage] = useState("");
    const [viewDetails, setViewDetails] = useState("");
  const [freeCancellationBefore, setFreeCancellationBefore] = useState(1); // New Field
  const [nightCharge, setNightCharge] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subCategoryData, setSubCategoryData] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  const [gst, setGst] = useState(null);
  const [secureFees, setSecureFees] = useState(null);
  const [platformFees, setPlatformFees] = useState(null);
  const [bulletPoints, setBulletPoints] = useState([""]); 
    
  
    const handleAddBulletPoint = () => {
      setBulletPoints([...bulletPoints, ""]);
    };
    
    const handleRemoveBulletPoint = (index) => {
      if (bulletPoints.length === 1) {
        toast.error("At least one bullet point is required.");
        return;
      }
      
      const updatedBulletPoints = bulletPoints.filter((_, i) => i !== index);
      setBulletPoints(updatedBulletPoints);
    };
    
    const handleBulletPointChange = (index, value) => {
      const updatedBulletPoints = [...bulletPoints];
      updatedBulletPoints[index] = value;
      setBulletPoints(updatedBulletPoints);
    };

  const handleCommissionChange = (e) => {
    const value = e.target.value === "" ? null : Number(e.target.value);
    setCommission(value);
    setPartnersPayPercentage(value !== null ? 100 - value : null);
  };

  const fetchSubCategoryData = async () => {
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
    // setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/sub_category/3`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        const data = response.data.data;

        // Populate state with menu data
        if (data.menu && data.menu.length > 0) {
          const formattedMenu = data.menu.map((item) => ({
            id: item.menu_id,
            name: item.name,
            price: parseFloat(item.price).toFixed(2), // Format price
          }));
          setFoodItems(formattedMenu); // Set food items state
        }

        // Map and sort API data for no_of_people
        const sortedRows = data.no_of_people
          .sort((a, b) => a.people_count - b.people_count)
          .map((item) => ({
            id: item.id,
            count: item.people_count,
            price: item.base_price,
            duration: item.aprox_time,
          }));
        setGuestRows(sortedRows);

        // Populate state with API data
        setStartTime(data.service_start_time.slice(0, 5));
        setEndTime(data.service_end_time.slice(0, 5));
        setNightChargesStartAt(data.night_charge_start_time.slice(0, 5));
        setNightChargesEndAt(data.night_charge_end_time.slice(0, 5));
        setBookBefore(data.booking_time_before || 1);
        setCancellationBefore(data.cancellation_time_before || 1);
        setFreeCancellationBefore(data.free_cancellation_time_before || 1);
        setSummary(data.booking_details || "");
        setCancellationPolicy(data.cancellation_policy || "");
        setBookingSummaryPage(data.booking_summary || "");
        setViewDetails(data.view_details || "");

        setNightCharge(data.night_charge || "");
        setGst(data.gst);
        setSecureFees(data.secure_fee || null);
        setPlatformFees(data.platform_fee || null);
        setBulletPoints(data.bullet_points || [""]);

        setPartnerTax(data.partner_tax);
        setCommission(data.commission || null);
        setPartnersPayPercentage(
          data.commission !== null ? 100 - data.commission : null
        );

        // Populate guestRows based on API response (if provided)
        if (data.no_of_people && data.no_of_people.length > 0) {
        }
      } else {
        toast.error("Failed to fetch sub-category data.");
      }
    } catch (error) {
      console.error("Error fetching sub-category data:", error);
      toast.error("An error occurred while fetching data.");
    }
  };
  useEffect(() => {
    fetchSubCategoryData();
  }, []);

  const handleAddRow = () => {
    // Get the count of the last row, default to 1 if it's the first row
    const lastCount =
      guestRows.length > 0 ? guestRows[guestRows.length - 1].count : 0;

    // Check if the new count exceeds the max limit
    // if (lastCount >= 15) {
    //   toast.error("Guest count cannot exceed 15.");
    //   return;
    // }

    // Add the new row with incremented count
    setGuestRows([
      ...guestRows,
      { id: guestRows.length, count: lastCount + 1, duration: "", price: "" },
    ]);
  };

  const handleRemoveRow = (id) => {
    if (guestRows.length > 1) {
      setGuestRows(guestRows.filter((row) => row.id !== id));
    } else {
      toast.error("At least one guest slot is required.");
    }
  };

  const handleCountChange = (index, increment) => {
    const newRows = [...guestRows];

    // Check if the count exceeds the maximum limit
    // if (increment && newRows[index].count >= 15) {
    //   toast.error("Guest count cannot exceed 15.");
    //   return;
    // }

    // Update count
    newRows[index].count = increment
      ? newRows[index].count + 1
      : Math.max(newRows[index].count - 1, 1); // Prevent count from going below 1

    setGuestRows(newRows);
  };

  const handleEditClick = (item) => {
    setSelectedFoodItem(item);
    setShowModal(true); // Set this to true to open the modal
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSaveFoodItem = (updatedItem) => {
    const updatedFoodItems = foodItems.map(
      (item) => (item.id === updatedItem.id ? updatedItem : item) // Use item.id for more reliable matching
    );
    setFoodItems(updatedFoodItems);
    setShowModal(false);
  };

  const handleDurationChange = (index, value) => {
    const newRows = [...guestRows];
    newRows[index].duration = value;
    setGuestRows(newRows);
  };

  const handlePriceChange = (index, value) => {
    const newRows = [...guestRows];
    newRows[index].price = value;
    setGuestRows(newRows);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

    // Create FormData object
    const formData = new FormData();

    // Validate that all bullet points are filled
        const hasEmptyBulletPoint = bulletPoints.some(
          (point) => point.trim() === ""
        );
        if (hasEmptyBulletPoint) {
          toast.error("Please fill out all bullet points before submitting.");
          return;
        }

    // Validate that all guest count and price fields are filled
    const invalidGuestRow = guestRows.some(
      (row) => !row.count || row.count < 1 || !row.price || row.price <= 0
    );
    if (invalidGuestRow) {
      toast.error(
        "Please fill out all guest counts and prices before submitting."
      );
      return; // Prevent form submission if validation fails
    }

    const guestCounts = guestRows.map((row) => row.count);
    const hasDuplicateGuestCounts =
      guestCounts.length !== new Set(guestCounts).size;
    if (hasDuplicateGuestCounts) {
      toast.error(
        "Guest counts should be unique. Please add different guest counts."
      );
      return;
    }

    // Validate that guest counts are in ascending order
    const isAscendingOrder = guestCounts.every(
      (count, index, array) => index === 0 || count >= array[index - 1]
    );
    if (!isAscendingOrder) {
      toast.error("Guest counts should be in ascending order.");
      return;
    }

    // Validate that the number of rows does not exceed 15
    // if (guestRows.length > 15) {
    //   toast.error("Guest count cannot exceed 15.");
    //   return;
    // }

    // Add required fields
    formData.append("category_id", 1); // Add category_id explicitly
    formData.append("sub_category_id", 3); // Add sub_category_id explicitly
    formData.append("service_start_time", startTime);
    formData.append("service_end_time", endTime);
    formData.append("night_charge_start_time", nightChargesStartAt);
    formData.append("night_charge_end_time", nightChargesEndAt);
    formData.append("booking_time_before", bookBefore);
    formData.append("cancellation_time_before", cancellationBefore);
    formData.append("free_cancellation_time_before", freeCancellationBefore);
    formData.append("booking_details", summary);
    formData.append("cancellation_policy", cancellationPolicy);
    formData.append("booking_summary", bookingSummaryPage);
    formData.append("view_details", viewDetails);
    formData.append("night_charge", nightCharge ?? "");
    formData.append("gst", gst ?? "0");
    formData.append("partner_tax", partnerTax ?? "0");
    formData.append("secure_fee", secureFees || "");
    formData.append("platform_fee", platformFees ?? "");
    formData.append("commission", commission || "");
    formData.append("bullet_points", JSON.stringify(bulletPoints));


    // Add `no_of_people` data
    const noOfPeopleData = guestRows.map((row) => ({
      people_count: row.count,
      base_price: row.price,
      aprox_time: row.duration,
    }));
    formData.append("no_of_people", JSON.stringify(noOfPeopleData));

    // Loading state
    setLoading(true);

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/sub_category`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Sub-category updated successfully!");
        fetchSubCategoryData(); // Refresh the data after update
      } else {
        toast.error(response.data.message || "Failed to update sub-category.");
      }
    } catch (error) {
      console.error("Error updating sub-category:", error);
      toast.error("An error occurred while updating the sub-category.");
    } finally {
      setLoading(false);
    }
  };
  const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i < 24 * 60; i += 15) {
      const hours = Math.floor(i / 60)
        .toString()
        .padStart(2, "0");
      const minutes = (i % 60).toString().padStart(2, "0");
      times.push(`${hours}:${minutes}`);
    }
    return times;
  };

  const timeOptions = generateTimeOptions();
  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">Chef for Party</h3>
      <form onSubmit={handleSubmit}>
        {/* Start Time, End Time, Night Charges Start At */}
        <div className="row mb-3 align-items-center">
          {/* <div className="col-md-3">
            <label htmlFor="startTime" className="form-label">
              Start Time
            </label>
            <select
              className="form-control"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            >
              <option value="" disabled>
                Select start time
              </option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="endTime" className="form-label">
              End Time
            </label>
            <select
              className="form-control"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            >
              <option value="" disabled>
                Select end time
              </option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div> */}

<div className="col-md-3">
  <label htmlFor="startTime" className="form-label">Start Time</label>
  <select
    className="form-control"
    id="startTime"
    value={startTime}
    onChange={(e) => {
      setStartTime(e.target.value);
      if (e.target.value === endTime) {
        setEndTime(""); // Reset endTime if it's the same as startTime
      }
    }}
    required
  >
    <option value="" disabled>Select start time</option>
    {timeOptions.map((time) => (
      <option 
        key={time} 
        value={time} 
        disabled={time === endTime} 
        style={time === endTime ? { backgroundColor: "#d3d3d3", cursor: "not-allowed" } : {}}
      >
        {time}
      </option>
    ))}
  </select>
</div>

<div className="col-md-3">
  <label htmlFor="endTime" className="form-label">End Time</label>
  <select
    className="form-control"
    id="endTime"
    value={endTime}
    onChange={(e) => {
      if (e.target.value === startTime) {
        toast.error("End time cannot be the same as start time.");
      } else {
        setEndTime(e.target.value);
      }
    }}
    required
  >
    <option value="" disabled>Select end time</option>
    {timeOptions.map((time) => (
      <option 
        key={time} 
        value={time} 
        disabled={time === startTime} 
        style={time === startTime ? { backgroundColor: "#d3d3d3", cursor: "not-allowed" } : {}}
      >
        {time}
      </option>
    ))}
  </select>
</div>

          <div className="col-md-3">
            <label htmlFor="nightChargesStartAt" className="form-label">
              Night Charges Start At
            </label>
            <select
              className="form-control"
              id="nightChargesStartAt"
              value={nightChargesStartAt}
              onChange={(e) => setNightChargesStartAt(e.target.value)}
              required
            >
              <option value="" disabled>
                Select time
              </option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label htmlFor="nightChargesEndAt" className="form-label">
              Night Charges End At
            </label>
            <select
              className="form-control"
              id="nightChargesEndAt"
              value={nightChargesEndAt}
              onChange={(e) => setNightChargesEndAt(e.target.value)}
              required
            >
              <option value="" disabled>
                Select time
              </option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Booking and Cancellation Fields */}
        <div className="row mb-3 align-items-center">
          <div className="col-md-3">
            <label htmlFor="bookBefore" className="form-label">
              Time Before Booking (minutes)
            </label>
            <input
              type="number"
              className="form-control"
              id="bookBefore"
              value={bookBefore === null ? "" : bookBefore} // Set value to empty string when null
              onChange={(e) =>
                setBookBefore(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              min="1"
              required
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="cancellationBefore" className="form-label">
              Time Before Cancellation (minutes)
            </label>
            <input
              type="number"
              className="form-control"
              id="cancellationBefore"
              value={cancellationBefore === null ? "" : cancellationBefore} // Set value to empty string when null
              onChange={(e) =>
                setCancellationBefore(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              min="1"
              required
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="freeCancellationBefore" className="form-label">
              Free Cancellation Before (minutes)
            </label>
            <input
              type="number"
              className="form-control"
              id="freeCancellationBefore"
              value={
                freeCancellationBefore === null ? "" : freeCancellationBefore
              } // Set value to empty string when null
              onChange={(e) =>
                setFreeCancellationBefore(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              min="1"
              required
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="nightCharges" className="form-label">
              Night Charges (in currency)
            </label>
            <input
              type="number"
              className="form-control"
              id="nightCharges"
              placeholder="Enter charges"
              min="0"
              value={nightCharge ?? ""} // Ensures 0 is not replaced
              onChange={(e) =>
                setNightCharge(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              required
            />
          </div>
        </div>

        <div className="row mb-3 align-items-center">
        <div className="col-md-3">
  <label htmlFor="gst" className="form-label">Tax on commission & Platform Fee</label>
  <input
    type="number"
    className="form-control"
    id="gst"
    value={gst === null ? "" : gst}
    onChange={(e) => {
      let value = e.target.value === "" ? null : Number(e.target.value);
      setGst(value);
    }}
    min="0"
    required
  />
</div>
          {/* <div className="col-md-3">
    <label htmlFor="secureFees" className="form-label">Secure Fees</label>
    <input
      type="number"
      className="form-control"
      id="secureFees"
      value={secureFees === null ? "" : secureFees} // Set value to empty string when null
      onChange={(e) => setSecureFees(e.target.value === "" ? null : Number(e.target.value))}
      min="1"
      required
    />
  </div> */}

<div className="col-md-3">
  <label htmlFor="partnerTax" className="form-label">Tax on Partner's Pay</label>
  <input
    type="number"
    className="form-control"
    id="partnerTax"
    value={partnerTax === null ? "" : partnerTax}
    onChange={(e) => {
      let value = e.target.value === "" ? null : Number(e.target.value);
      setPartnerTax(value);
    }}
    min="0"
    required
  />
</div>

          <div className="col-md-3">
            <label htmlFor="commission" className="form-label">
              Servyo Commission %
            </label>
            <input
              type="number"
              className="form-control"
              id="commission"
              value={commission === null ? "" : commission}
              onChange={handleCommissionChange}
              min="1"
              max="100"
              required
            />
          </div>

          {/* Partner's Pay Percentage (Automatically calculated) */}
          <div className="col-md-3">
            <label htmlFor="partnersPay" className="form-label">
              Partner's Commission %
            </label>
            <input
              type="number"
              className="form-control"
              id="partnersPay"
              value={
                partnersPayPercentage === null ? "" : partnersPayPercentage
              }
              disabled // Prevents manual editing
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="platformFees" className="form-label">
              Platform Fees
            </label>
            <input
              type="number"
              className="form-control"
              id="platformFees"
              value={platformFees ?? ""} // Set value to empty string when null
              onChange={(e) =>
                setPlatformFees(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              min="1"
              required
            />
          </div>
        </div>

        <div className="MainDining_AddTable mb-5 mt-5">
          <p className="Subheading1_AddTable">
            Time duration and price as per guest count
          </p>
          <div className="row" style={{ justifyContent: "center" }}>
            {guestRows.map((row, index) => (
              <div
                key={row.id}
                className="row mb-3"
                style={{
                  backgroundColor: "#F6F8F9",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <div className="col-12 col-md-3 p-4">
                  <div className="Subheading2_AddTable">
                    COUNT OF GUESTS <span className="text-danger">*</span>
                  </div>
                  <div className="component-guest2">
                    {row.count}
                    <div className="innerSvg_AddTable">
                      <BiMinus
                        className="SubinnerSvg"
                        onClick={() => handleCountChange(index, false)}
                        disabled={row.count <= 1}
                      />
                      <HiPlusSmall
                        className="SubinnerSvg"
                        onClick={() => handleCountChange(index, true)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-3 p-4">
                  <div className="Subheading2_AddTable">
                    PRICE <span className="text-danger">*</span>
                  </div>
                  <div className="seating_AddTable">
                    <input
                      type="number"
                      value={row.price || ""}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                      className="form-control"
                      placeholder="Enter price"
                      // min="0"
                      required
                    />
                  </div>
                </div>

                <div className="col-12 col-md-3 p-4">
                  <div className="Subheading2_AddTable">
                    DURATION (in minutes) <span className="text-danger">*</span>
                  </div>
                  <div className="seating_AddTable">
                    <div className="component-guest1">
                      <input
                        type="number"
                        value={row.duration || ""}
                        onChange={(e) =>
                          handleDurationChange(index, e.target.value)
                        }
                        className="form-control"
                        placeholder="Enter duration in minutes"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="col-12 col-md-2 p-4 mt-4 d-flex align-items-center"
                  style={{ justifyContent: "space-evenly" }}
                >
                  {index === guestRows.length - 1 && (
                    <HiPlus
                      className="svg_AddTable"
                      style={{ fontSize: "25px" }}
                      onClick={handleAddRow}
                    />
                  )}
                  <IoMdBackspace
                    className="svg_AddTable"
                    onClick={() => handleRemoveRow(row.id)}
                    style={{ marginRight: "10px", fontSize: "25px" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="MainDining_AddTable mb-5 mt-5">
          <p className="form-label">Food Items</p>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Sr. No.</th>
                <th style={{ textAlign: "center" }}>Food Item Name</th>
                <th style={{ textAlign: "center" }}>Price</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {foodItems.length > 0 ? (
                foodItems.map((item, index) => (
                  <tr key={item.id}>
                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                    <td style={{ textAlign: "center" }}>{item.name}</td>
                    <td style={{ textAlign: "center" }}>{item.price} Rs.</td>
                    <td style={{ textAlign: "center" }}>
                      <MdEdit
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEditClick(item)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No food items available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bullet points */}
        <div className="MainDining_AddTable mb-5 mt-5">
          <p className="Subheading1_AddTable">Bullet Points</p>
          <div
            className="menu-container"
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {bulletPoints.length === 0 && setBulletPoints([""])}{" "}
            {/* Ensure one input exists */}
            {bulletPoints.map((point, index) => (
              <div
                key={index}
                className="menu-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#F6F8F9",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Bullet Point Input */}
                <div style={{ flex: 1, marginRight: "15px" }}>
                  <label
                    className="Subheading2_AddTable"
                    style={{ fontWeight: "600" }}
                  >
                    Bullet Point <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    value={point}
                    onChange={(e) =>
                      handleBulletPointChange(index, e.target.value)
                    }
                    className="form-control"
                    placeholder="Enter Bullet Point"
                    required
                    style={{
                      marginTop: "5px",
                      padding: "8px",
                      fontSize: "18px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div
                  className="menu-actions mt-4"
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {/* Add Button (Always shown for last input) */}
                  {index === bulletPoints.length - 1 && (
                    <HiPlus
                      className="svg_AddTable"
                      style={{ fontSize: "25px", cursor: "pointer" }}
                      onClick={handleAddBulletPoint}
                    />
                  )}

                  {/* Remove Button (Hidden if only one input remains) */}
                  {bulletPoints.length > 1 && (
                    <IoMdBackspace
                      className="svg_AddTable"
                      style={{ fontSize: "25px", cursor: "pointer" }}
                      onClick={() => handleRemoveBulletPoint(index)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="MainDining_AddTable mb-5 mt-5">
          <h4 className="form-label">
            Additional Details (Booking Details Summary)
          </h4>
          <ReactQuill
            value={summary}
            onChange={setSummary}
            placeholder="Write the booking details here..."
            theme="snow"
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["bold", "italic", "underline"],
                [{ align: [] }],
                ["link"],
                ["blockquote"],
                [{ indent: "-1" }, { indent: "+1" }],
                [{ direction: "rtl" }],
              ],
            }}
          />
        </div>

        {/* Cancellation Policy Editor */}
        <div className="MainDining_AddTable mb-5 mt-5">
          <h4 className="form-label">Cancellation Policy</h4>
          <ReactQuill
            value={cancellationPolicy}
            onChange={setCancellationPolicy}
            placeholder="Write the cancellation policy here..."
            theme="snow"
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["bold", "italic", "underline"],
                [{ align: [] }],
                ["link"],
                ["blockquote"],
                [{ indent: "-1" }, { indent: "+1" }],
                [{ direction: "rtl" }],
              ],
            }}
          />
        </div>

        {/* Booking Summary Page Editor */}
        <div className="MainDining_AddTable mb-5 mt-5">
          <h4 className="form-label">
            Additional Details (Booking Summary Page)
          </h4>
          <ReactQuill
            value={bookingSummaryPage}
            onChange={setBookingSummaryPage}
            placeholder="Write the booking summary page content here..."
            theme="snow"
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["bold", "italic", "underline"],
                [{ align: [] }],
                ["link"],
                ["blockquote"],
                [{ indent: "-1" }, { indent: "+1" }],
                [{ direction: "rtl" }],
              ],
            }}
          />
        </div>

        <div className="MainDining_AddTable mb-5 mt-5">
                  <h4 className="form-label">
                    View Details (Booking Summary Page)
                  </h4>
                  <ReactQuill
                    value={viewDetails}
                    onChange={setViewDetails}
                    placeholder="Write the View Details content here..."
                    theme="snow"
                    modules={{
                      toolbar: [
                        [{ header: "1" }, { header: "2" }, { font: [] }],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["bold", "italic", "underline"],
                        [{ align: [] }],
                        ["link"],
                        ["blockquote"],
                        [{ indent: "-1" }, { indent: "+1" }],
                        [{ direction: "rtl" }],
                      ],
                    }}
                  />
                </div>

        <div style={{ textAlign: "center" }}>
          <button
            type="submit"
            className="btn btn-primary w-50 mt-4"
            onClick={(e) => {
              handleSubmit(e);
              setTimeout(() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }, 500);
            }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      <FoodItemsEditModal
        show={showModal}
        onClose={() => setShowModal(false)}
        foodItem={selectedFoodItem}
        onSave={handleSaveFoodItem}
        fetchSubCategoryData={fetchSubCategoryData}
      />
    </div>
  );
};

export default ChefForParty;
