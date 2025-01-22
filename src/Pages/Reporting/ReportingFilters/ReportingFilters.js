import React, { useState } from "react";
import './ReportingFilters.css';

const ReportingFilters = ({ onSearch,onClear }) => {
  const [filters, setFilters] = useState({
    category_id: "",
    sub_category_id: "",
    payment_mode: "",
    booking_status: "",
    payment_status: "",
    month_duration: "",
    from_date: "",
    to_date: "",
    from_time: "",
    to_time: "",
  });


  // Mapping categories to subcategories
  const subCategories = {
    "1": [
      { value: "1", label: "Cook for one meal" },
      { value: "2", label: "Cook for one day" },
      { value: "3", label: "Chef for party" }
    ],
    "2": [
      { value: "4", label: "Round trip" },
      { value: "5", label: "One Way Trip" },
      { value: "6", label: "One Day Ride" },
      { value: "7", label: "Outstation Round trip" }
    ],
    "3": [
      { value: "8", label: "One Time Visit" },
      { value: "9", label: "Monthly subscription" }
    ],
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });

    // Reset sub_category_id if category_id changes
    if (name === "category_id") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        sub_category_id: "",
      }));
    }
  };

  const handleClearFilters = () => {
    setFilters({
      category_id: "",
      sub_category_id: "",
      payment_mode: "",
      booking_status: "",
      payment_status: "",
      month_duration: "",
      from_date: "",
      to_date: "",
      from_time: "",
      to_time: "",
    });
  };

  const handleSearch = () => {
    // Send the filter data back to the parent component
    onSearch(filters);
  };

  return (
    <div className="filter-page">
      <h2 className="filter-title">Filter Page</h2>
      <form className="filter-form">
        <div className="filter-row">
          <div className="filter-item">
            <label>Category :</label>
            <select name="category_id" value={filters.category_id} onChange={handleChange}>
              <option value="">Select Category</option>
              <option value="1">Cook</option>
              <option value="2">Driver</option>
              <option value="3">Gardener</option>
            </select>
          </div>
          <div className="filter-item">
            <label>Sub-Category :</label>
            <select
              name="sub_category_id"
              value={filters.sub_category_id}
              onChange={handleChange}
              disabled={!filters.category_id}
            >
              <option value="">Select Sub-Category</option>
              {filters.category_id &&
                subCategories[filters.category_id].map((subCat) => (
                  <option key={subCat.value} value={subCat.value}>
                    {subCat.label}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-item">
            <label>Payment Mode :</label>
            <select name="payment_mode" value={filters.payment_mode} onChange={handleChange}>
              <option value="">Select Payment Mode</option>
              <option value="cash">Cash</option>
              <option value="online">Online</option>
            </select>
          </div>
          <div className="filter-item">
            <label>Booking Status :</label>
            <select name="booking_status" value={filters.booking_status} onChange={handleChange}>
              <option value="">Select Booking Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-item">
            <label>Payment Status :</label>
            <select name="payment_status" value={filters.payment_status} onChange={handleChange}>
              <option value="">Select Payment Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
          <div className="filter-item">
            <label>Month Duration :</label>
            <select name="month_duration" value={filters.month_duration} onChange={handleChange}>
              <option value="">Select Duration</option>
              <option value="1">1 Month</option>
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
            </select>
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-item">
            <label>From Date :</label>
            <input type="date" name="from_date" value={filters.from_date} onChange={handleChange} />
          </div>
          <div className="filter-item">
            <label>To Date :</label>
            <input type="date" name="to_date" value={filters.to_date} onChange={handleChange} />
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-item">
            <label>From Time :</label>
            <input type="time" name="from_time" value={filters.from_time} onChange={handleChange} />
          </div>
          <div className="filter-item">
            <label>To Time :</label>
            <input type="time" name="to_time" value={filters.to_time} onChange={handleChange} />
          </div>
        </div>
        <div className="filter-buttons">
        <button type="button" onClick={handleSearch} className="Discount-btn">
          Search
        </button>

        <button type="button" onClick={handleClearFilters} className="Discount-btn">
            Clear Filter
          </button>

        </div>
      </form>
      <hr/>
    </div>
  );
};

export default ReportingFilters;
