import React, { useState, useEffect } from "react";
import { HiPlus, HiPlusSm } from "react-icons/hi";
import { IoMdBackspace } from "react-icons/io";
import { HiPlusSmall } from "react-icons/hi2";
import { BiMinus } from "react-icons/bi";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import axios from "axios";

const CookForDay = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [nightChargesStartAt, setNightChargesStartAt] = useState("");
  const [nightChargesEndAt, setNightChargesEndAt] = useState(""); // New Field
  const [bookBefore, setBookBefore] = useState(1);
  const [cancellationBefore, setCancellationBefore] = useState(1);
  const [freeCancellationBefore, setFreeCancellationBefore] = useState(1); // New Field
  const [summary, setSummary] = useState("");
  const [nightCharge, setNightCharge] = useState([]);
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [bookingSummaryPage, setBookingSummaryPage] = useState("");
  const [loading, setLoading] = useState(false);
  const [subCategoryData, setSubCategoryData] = useState(null);
  const [guestRows, setGuestRows] = useState([
    { id: 0, count: 1, duration: "", price: "" },
  ]);

  // Fetch data for sub_category_id = 2

  const fetchSubCategoryData = async () => {
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
    // setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/sub_category/2`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        const data = response.data.data;

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
        setCancellationBefore(data.free_cancellation_time_before || 1);
        setFreeCancellationBefore(data.free_cancellation_time_before || 1);
        setSummary(data.booking_details || "");
        setCancellationPolicy(data.cancellation_policy || "");
        setBookingSummaryPage(data.booking_summary || "");
        setNightCharge(data.night_charge || "");

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
    if (lastCount >= 15) {
      toast.error("Guest count cannot exceed 15.");
      return;
    }

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

    // Add required fields
    formData.append("category_id", 1); // Add category_id explicitly
    formData.append("sub_category_id", 2); // Add sub_category_id explicitly
    formData.append("service_start_time", startTime);
    formData.append("service_end_time", endTime);
    formData.append("night_charge_start_time", nightChargesStartAt);
    formData.append("night_charge_end_time", nightChargesEndAt);
    formData.append("booking_time_before", bookBefore);
    formData.append("cancellation_time_before", cancellationBefore);
    formData.append("free_cancellation_time_before", freeCancellationBefore);
    formData.append("cancellation_policy", cancellationPolicy);
    formData.append("booking_summary", bookingSummaryPage);
    formData.append("booking_details", summary);
    formData.append("night_charge", nightCharge || "");

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
      <h3 className="text-center mb-4">Cook for One day</h3>
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
          <p className="Subheading1_AddTable">
            Time duration and price as per guest count
          </p>
          <div className="row" style={{ justifyContent: "center" }}>
            {guestRows.map((row, index) => (
              <div
                key={row.id}
                className="row mb-3"
                style={{ backgroundColor: "#F6F8F9", justifyContent: "center" }}
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
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="col-12 col-md-3 p-4">
                  <div className="Subheading2_AddTable">
                    DURATION (Fixed: 12 hours)
                  </div>
                  <div className="seating_AddTable">
                    <div className="component-guest1">
                      <input
                        type="text"
                        value="720 minutes"
                        className="form-control"
                        readOnly
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

export default CookForDay;

