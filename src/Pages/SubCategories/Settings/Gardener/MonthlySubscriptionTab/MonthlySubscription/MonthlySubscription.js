import React, { useState, useEffect } from "react";
import { HiPlus, HiPlusSm } from "react-icons/hi";
import { IoMdBackspace } from "react-icons/io";
import { HiPlusSmall } from "react-icons/hi2";
import { BiMinus } from "react-icons/bi";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import axios from "axios";

const MonthlySubscription = () => {
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
  const [additionalPriceHours, setAdditionalPriceHours] = useState("");
  const [guestRows, setGuestRows] = useState([
    { id: 0, count: 1, duration: "", price: "" },
  ]);

  // Fetch data for sub_category_id = 2

  const fetchSubCategoryData = async () => {
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/sub_category/9`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        const data = response.data.data;
  
        // Populate state with API data
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
  
        // Map gardener monthly visit calculations to hourRows
        if (data.gardener_monthly_visit_calculations.length > 0) {
          const mappedHours = data.gardener_monthly_visit_calculations.map((item) => ({
            id: item.id, // Use the actual ID from the API response
            visitCount: item.visit, // Map `visit` to `visitCount`
            duration: item.hours, // Map `hours` to `duration`
            price: parseFloat(item.price).toFixed(2), // Format price to 2 decimal places
          }));
          setHourRows(mappedHours);
        } else {
          // Default initial row if no data exists
          setHourRows([
            { id: 0, visitCount: "", duration: "", price: "" },
          ]);
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
  

  const [hourRows, setHourRows] = useState([
    { id: 0, visitCount: 1, duration: "", price: "" },
  ]);

  const handleAddRow = () => {
    const lastVisitCount =
      hourRows.length > 0 ? hourRows[hourRows.length - 1].visitCount : 0;

    if (lastVisitCount >= 15) {
      toast.error("Visit count cannot exceed 15.");
      return;
    }

    setHourRows([
      ...hourRows,
      {
        id: hourRows.length,
        visitCount: lastVisitCount + 1,
        duration: "",
        price: "",
      },
    ]);
  };

  const handleRemoveRow = (id) => {
    if (hourRows.length > 1) {
      setHourRows(hourRows.filter((row) => row.id !== id));
    } else {
      toast.error("At least one visit slot is required.");
    }
  };

  const handleDurationChange = (index, value) => {
    const updatedRows = [...hourRows];
    updatedRows[index] = { ...updatedRows[index], duration: value };
    setHourRows(updatedRows);
  };

  const handlePriceChange = (index, value) => {
    const updatedRows = [...hourRows];
    updatedRows[index] = { ...updatedRows[index], price: value };
    setHourRows(updatedRows);
  };

  const handleVisitCountChange = (index, value) => {
    const updatedRows = [...hourRows];
    updatedRows[index] = { ...updatedRows[index], visitCount: value };
    setHourRows(updatedRows);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");

    // Validate required fields
    const isValidData = hourRows.every(
      (row) => row.visitCount && row.duration && row.price
    );

    if (!isValidData) {
      toast.error("Please fill in all required fields for each row");
      return;
    }

    // Create FormData object
    const formData = new FormData();

    // Add required fields
    formData.append("category_id", "3");
    formData.append("sub_category_id", "9");
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

    // Format the data according to the expected structure
    const visitCalculations = hourRows.map((row) => ({
      visit: row.visitCount,
      hours: row.duration,
      price: row.price,
    }));

    console.log(
      "gardener_monthly_visit_calculations:",
      JSON.stringify(visitCalculations)
    );

    // Append the formatted data
    formData.append(
      "gardener_monthly_visit_calculations",
      JSON.stringify(visitCalculations)
    );

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
        fetchSubCategoryData();
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
      <h3 className="text-center mb-4">Monthly Subscription</h3>
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
                <div className="col-12 col-md-3 p-4">
                  <div className="Subheading2_AddTable">
                    VISIT COUNT <span className="text-danger">*</span>
                  </div>
                  <div className="seating_AddTable">
                    <input
                      type="number"
                      value={row.visitCount}
                      onChange={(e) =>
                        handleVisitCountChange(index, e.target.value)
                      }
                      className="form-control"
                      placeholder="Enter visit count"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="col-12 col-md-3 p-4">
                  <div className="Subheading2_AddTable">
                    DURATION (in hours) <span className="text-danger">*</span>
                  </div>
                  <div className="seating_AddTable">
                    <input
                      type="number"
                      value={row.duration}
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

                <div className="col-12 col-md-3 p-4">
                  <div className="Subheading2_AddTable">
                    PRICE <span className="text-danger">*</span>
                  </div>
                  <div className="seating_AddTable">
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                      className="form-control"
                      placeholder="Enter price"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div
                  className="col-12 col-md-3 p-4 mt-4 d-flex align-items-center"
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

export default MonthlySubscription;

{
  /* Booking Summary Page Editor */
}
//  <div className="MainDining_AddTable mb-5 mt-5">
//  <h4 className="form-label">
//    Additional Details (Booking Summary Page)
//  </h4>
//  <ReactQuill
//    value={bookingSummaryPage}
//    onChange={setBookingSummaryPage}
//    placeholder="Write the booking summary page content here..."
//    theme="snow"
//    modules={{
//      toolbar: [
//        [{ header: "1" }, { header: "2" }, { font: [] }],
//        [{ list: "ordered" }, { list: "bullet" }],
//        ["bold", "italic", "underline"],
//        [{ align: [] }],
//        ["link"],
//        ["blockquote"],
//        [{ indent: "-1" }, { indent: "+1" }],
//        [{ direction: "rtl" }],
//      ],
//    }}
//  />
// </div>