import React, { useState, useEffect } from "react";
import { HiPlus, HiPlusSm } from "react-icons/hi";
import { IoMdBackspace } from "react-icons/io";
import { HiPlusSmall } from "react-icons/hi2";
import { BiMinus } from "react-icons/bi";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import axios from "axios";

const GardnerDayVisit = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [nightChargesStartAt, setNightChargesStartAt] = useState("");
  const [bookBefore, setBookBefore] = useState(1);
  const [cancellationBefore, setCancellationBefore] = useState(1);
  const [freeCancellationBefore, setFreeCancellationBefore] = useState(1); // New Field
  const [summary, setSummary] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState([]);
  const [selectedCarType, setSelectedCarType] = useState([]); // Car type state
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditData, setCurrentEditData] = useState({});
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [bookingSummaryPage, setBookingSummaryPage] = useState("");
  const [nightCharge, setNightCharge] = useState([]);
  const [loading, setLoading] = useState(false);
  const [additionalPriceHours, setAdditionalPriceHours] = useState("");
  const [nightChargesEndAt, setNightChargesEndAt] = useState(""); // New Field

  const [guestRows, setGuestRows] = useState([
    { id: 0, count: 1, duration: "", price: "" },
  ]);

  const fetchSubCategoryData = async () => {
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/sub_category/8`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        const data = response.data.data;
        setStartTime(data.service_start_time.slice(0, 5));
        setEndTime(data.service_end_time.slice(0, 5));
        setNightChargesStartAt(data.night_charge_start_time.slice(0, 5));
        setNightChargesEndAt(data.night_charge_end_time.slice(0, 5));
        setBookBefore(data.booking_time_before);
        setCancellationBefore(data.cancellation_time_before);
        setFreeCancellationBefore(data.free_cancellation_time_before);
        setSummary(data.booking_details || "");
        setCancellationPolicy(data.cancellation_policy || "");
        setBookingSummaryPage(data.booking_summary || "");
        setNightCharge(data.night_charge || "");
        setAdditionalPriceHours(data.additional_price_hours || {});
  
        // Process gardener_hours_calculations
        if (data.gardener_hours_calculations.length > 0) {
          const mappedHours = data.gardener_hours_calculations.map((item) => ({
            id: item.id, 
            duration: item.hours || 1, // Assign 1 as a default value if hours is not provided
            price: parseFloat(item.price).toFixed(2), // Format price to 2 decimal places
          }));
          setHourRows(mappedHours);
        }
      }
    } catch (error) {
      console.error("Error fetching sub-category data:", error);
    }
  };
  

  useEffect(() => {
    fetchSubCategoryData();
  }, []);

  const handleAddRow = () => {
    const lastDuration =
      hourRows.length > 0 ? hourRows[hourRows.length - 1].duration : 0;
    if (lastDuration >= 15) {
      toast.error("Duration cannot exceed 15 hours.");
      return;
    }
    setHourRows([
      ...hourRows,
      {
        id: hourRows.length > 0 ? hourRows[hourRows.length - 1].id + 1 : 1,
        duration: lastDuration + 1,
        price: ""
      }
    ]);
  };
  
  const handleRemoveRow = (id) => {
    console.log("Removing row with id:", id);
    console.log("Current hourRows:", hourRows);
    if (hourRows.length > 1) {
      setHourRows(hourRows.filter((row) => row.id !== id));
    } else {
      toast.error("At least one time duration and price entry is required.");
    }
  };
  
  const handleCountChange = (index, increment) => {
    const newRows = [...guestRows];

    // Check if the count exceeds the maximum limit
    if (increment && newRows[index].count >= 15) {
      toast.error("Guest count cannot exceed 15.");
      return;
    }

    // Update count
    newRows[index].count = increment
      ? newRows[index].count + 1
      : Math.max(newRows[index].count - 1, 1); // Prevent count from going below 1

    setGuestRows(newRows);
  };

  const handleDurationChange = (index, value) => {
    const newRows = [...hourRows];
    newRows[index].duration = value;
    setHourRows(newRows);
  };
  
  const handlePriceChange = (index, value) => {
    const newRows = [...hourRows];
    newRows[index].price = value; 
    setHourRows(newRows);
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
    const formData = new FormData();
    formData.append("category_id", 3); // Add category_id explicitly
    formData.append("sub_category_id", 8); // Add sub_category_id explicitly
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
    formData.append("night_charge", nightCharge || "");
    formData.append("additional_price_hours", additionalPriceHours);
  
    // Serialize no_of_people data
    const noOfPeopleData = guestRows.map((row) => ({
      people_count: row.count,
      base_price: row.price,
      aprox_time: row.duration,
    }));
    formData.append("no_of_people", JSON.stringify(noOfPeopleData));
  
    // Serialize gardener_hours_calculations data
    const gardenerHoursData = hourRows.map((row) => ({
      hours: row.duration,
      price: parseFloat(row.price).toFixed(2),
    }));
    formData.append("gardener_hours_calculations", JSON.stringify(gardenerHoursData));
  
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
  const [extraHourRows, setExtraHourRows] = useState([
    { id: 0, duration: "", price: "" },
  ]);
  const handleExtraDurationChange = (index, value) => {
    const newRows = [...extraHourRows];
    newRows[index].duration = value;
    setExtraHourRows(newRows);
  };

  const handleExtraPriceChange = (index, value) => {
    const newRows = [...extraHourRows];
    newRows[index].price = value;
    setExtraHourRows(newRows);
  };

  const handleAddExtraRow = () => {
    setExtraHourRows([
      ...extraHourRows,
      { id: extraHourRows.length, duration: "", price: "" },
    ]);
  };

  const handleRemoveExtraRow = (id) => {
    if (extraHourRows.length > 1) {
      setExtraHourRows(extraHourRows.filter((row) => row.id !== id));
    } else {
      toast.error("At least one extra charge slot is required.");
    }
  };
  const [hourRows, setHourRows] = useState([
    { id: 0, count: 1, duration: "", price: "" },
  ]);

  
  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">Gardener Day visit</h3>
      <form onSubmit={handleSubmit}>
        {/* Start Time, End Time, Night Charges Start At */}
        <div className="row mb-3 align-items-center">
          <div className="col-md-3">
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
              value={nightCharge === null ? "" : nightCharge} // Set value to empty string when null
              onChange={(e) =>
                setNightCharge(
                  e.target.value === "" ? null : Number(e.target.value) // Correct state update
                )
              }
              required
            />
          </div>
        </div>
        {/* Guest Time Slot Section */}
        <div className="MainDining_AddTable mb-5 mt-5">
          <p className="Subheading1_AddTable">Time duration and price</p>
          <div className="row" style={{ justifyContent: "center" }}>
            {hourRows.map((row, index) => (
              <div
                key={row.id}
                className="row mb-3"
                style={{
                  backgroundColor: "#F6F8F9",
                  justifyContent: "center",
                  width: "-webkit-fill-available",
                }}
              >
                <div className="col-12 col-md-5 p-4">
                  <div className="Subheading2_AddTable">
                    DURATION (in hours) <span className="text-danger">*</span>
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
                        placeholder="Enter duration in hours"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-5 p-4">
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
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div
                  className="col-12 col-md-2 p-4 mt-4 d-flex align-items-center"
                  style={{ justifyContent: "space-evenly" }}
                >
                  <IoMdBackspace
                    className="svg_AddTable"
                    onClick={() => handleRemoveRow(row.id)}
                    style={{ fontSize: "25px" }}
                  />
                  {index === hourRows.length - 1 && (
                    <HiPlus
                      className="svg_AddTable"
                      style={{ fontSize: "25px" }}
                      onClick={handleAddRow}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Extra Charges Section */}
        <div className="MainDining_AddTable mb-5 mt-5">
          <p className="Subheading1_AddTable">
            Extra Charges According to Minutes
          </p>
          <div className="row" style={{ justifyContent: "center" }}>
            {extraHourRows.map((row, index) => (
              <div
                key={row.id}
                className="row mb-3"
                style={{
                  backgroundColor: "#F6F8F9",
                  justifyContent: "center",
                  width: "-webkit-fill-available",
                }}
              >
                <div className="col-12 col-md-5 p-4">
                  <div className="Subheading2_AddTable">
                    EXTRA Minutes (in minutes){" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="seating_AddTable">
                    <input
                      type="number"
                      value={row.hours !== undefined ? row.hours : 1}
                      onChange={(e) =>
                        handleExtraDurationChange(index, e.target.value)
                      }
                      className="form-control"
                      placeholder="Enter extra minutes"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="col-12 col-md-5 p-4">
                  <div className="Subheading2_AddTable">
                    EXTRA CHARGES (in currency){" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="seating_AddTable">
                    <input
                      type="number"
                      value={additionalPriceHours} // Use the state variable
                      onChange={(e) => setAdditionalPriceHours(e.target.value)} // Update the state on change
                      className="form-control"
                      placeholder="Enter extra charges"
                      min="0"
                      required
                    />
                  </div>
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

        {/* Booking Summary Page Editor  */}
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

        <div style={{ textAlign: "center" }}>
          <button
            type="submit"
            className="btn btn-primary w-50 mt-4"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GardnerDayVisit;