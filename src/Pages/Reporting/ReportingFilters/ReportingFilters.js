import React, { useState } from "react";
import './ReportingFilters.css';

const ReportingFilters = ({ onSearch }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
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
            <select name="sub_category_id" value={filters.sub_category_id} onChange={handleChange}>
              <option value="">Select Sub-Category</option>
              <option value="1">Cook for one meal</option>
              <option value="2">One time driver</option>
              <option value="3">Caretaker</option>
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
            <input type="date" name="from_date" value={filters.created_at} onChange={handleChange} />
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
        <button type="button" onClick={handleSearch} className="Discount-btn">
          Search
        </button>
      </form>
    </div>
  );
};

export default ReportingFilters;







// import React, { useState } from "react";
// import './ReportingFilters.css'

// const ReportingFilters = () => {
//     const [filters, setFilters] = useState({
//         category_id: "",
//         sub_category_id: "",
//         payment_mode: "",
//         booking_status: "",
//         payment_status: "",
//         month_duration: "",
//         from_date: "",
//         to_date: "",
//         from_time: "",
//         to_time: "",
//       });
    
//       const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFilters({ ...filters, [name]: value });
//       };
    
//       const handleSearch = () => {
//         console.log("Search filters:", filters);
//         // Add your search logic here
//       };
    
//       return (
//         <div className="filter-page">
//           <h2 className="filter-title">Filter Page</h2>
//           <form className="filter-form">
//             <div className="filter-row">
//               <div className="filter-item">
//                 <label>Category ID:</label>
//                 <select name="category_id" value={filters.category_id} onChange={handleChange}>
//                   <option value="">Select Category</option>
//                   <option value="1">Category 1</option>
//                   <option value="2">Category 2</option>
//                   <option value="3">Category 3</option>
//                 </select>
//               </div>
//               <div className="filter-item">
//                 <label>Sub-Category ID:</label>
//                 <select name="sub_category_id" value={filters.sub_category_id} onChange={handleChange}>
//                   <option value="">Select Sub-Category</option>
//                   <option value="1">Sub-Category 1</option>
//                   <option value="2">Sub-Category 2</option>
//                   <option value="3">Sub-Category 3</option>
//                 </select>
//               </div>
//             </div>
//             <div className="filter-row">
//               <div className="filter-item">
//                 <label>Payment Mode:</label>
//                 <select name="payment_mode" value={filters.payment_mode} onChange={handleChange}>
//                   <option value="">Select Payment Mode</option>
//                   <option value="card">Card</option>
//                   <option value="cash">Cash</option>
//                   <option value="online">Online</option>
//                 </select>
//               </div>
//               <div className="filter-item">
//                 <label>Booking Status:</label>
//                 <select name="booking_status" value={filters.booking_status} onChange={handleChange}>
//                   <option value="">Select Booking Status</option>
//                   <option value="confirmed">Confirmed</option>
//                   <option value="pending">Pending</option>
//                   <option value="cancelled">Cancelled</option>
//                 </select>
//               </div>
//             </div>
//             <div className="filter-row">
//               <div className="filter-item">
//                 <label>Payment Status:</label>
//                 <select name="payment_status" value={filters.payment_status} onChange={handleChange}>
//                   <option value="">Select Payment Status</option>
//                   <option value="paid">Paid</option>
//                   <option value="unpaid">Unpaid</option>
//                 </select>
//               </div>
//               <div className="filter-item">
//                 <label>Month Duration:</label>
//                 <select name="month_duration" value={filters.month_duration} onChange={handleChange}>
//                   <option value="">Select Duration</option>
//                   <option value="1">1 Month</option>
//                   <option value="3">3 Months</option>
//                   <option value="6">6 Months</option>
//                 </select>
//               </div>
//             </div>
//             <div className="filter-row">
//               <div className="filter-item">
//                 <label>From Date:</label>
//                 <input
//                   type="date"
//                   name="from_date"
//                   value={filters.from_date}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="filter-item">
//                 <label>To Date:</label>
//                 <input
//                   type="date"
//                   name="to_date"
//                   value={filters.to_date}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//             <div className="filter-row">
//               <div className="filter-item">
//                 <label>From Time:</label>
//                 <input
//                   type="time"
//                   name="from_time"
//                   value={filters.from_time}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="filter-item">
//                 <label>To Time:</label>
//                 <input
//                   type="time"
//                   name="to_time"
//                   value={filters.to_time}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//             <button
//               type="button"
//               onClick={handleSearch}
//               className="search-button"
//             >
//               Search
//             </button>
//           </form>
//         </div>
//       );
//     };
    

// export default ReportingFilters;
