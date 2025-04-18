import React, { useState } from "react";
import './ReportingFilters.css';
import jsPDF from "jspdf";
import "jspdf-autotable";


const ReportingFilters = ({ onSearch, onClear ,tableData}) => {
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
    user_type: "",
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
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
      ...(name === "category_id" ? { sub_category_id: "" } : {}),
    }));
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
      user_type: "",
    });
    onClear();
  };

  const handleSearch = () => {
    onSearch(filters);
  };




//   const handleDownloadPdf = (exportType) => {
//  console.log(exportType)
//   };

const handleDownloadPdf = (exportType) => {
  const excludedColumns = [
    "sub_booking_id",
    "number_of_people",
    "category",
    "sub_category_name",
    "created_at",
    "updated_at",
    "address_from",
    "address_from_latitude",
    "address_from_longitude",
    "address_to",
    "address_to_latitude",
    "address_to_longitude",
    "start_job_attachments",
    "end_job_attachments",
    "customer",
    "short_address_to",

    "short_address_to",
    "short_address_from",
    "short_address_visit",

    "customer_id",
    "sub_category_id",





  ];

  // Create a new window for the PDF
  const pdfWindow = window.open('', '_blank');
  
  // Extract all unique keys from the data to create column headers, excluding specified columns
  const allKeys = new Set();
  tableData.forEach(item => {
    Object.keys(item).forEach(key => {
      if (!excludedColumns.includes(key)) {
        allKeys.add(key);
      }
    });
  });
  const headers = Array.from(allKeys);

  // Create HTML content for the PDF
  let htmlContent = `
    <html>
      <head>
        <title>Servyo PDF Reporting Sheet</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            word-wrap: break-word;
            max-width: 300px;
          }
          th {
            background-color: #f2f2f2;
            position: sticky;
            top: 0;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .pdf-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .timestamp {
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="pdf-header">
          <h1>Servyo PDF Reporting Sheet</h1>
          <div class="timestamp">Generated on: ${new Date().toLocaleString()}</div>
        </div>
        <table>
          <thead>
            <tr>
              ${headers.map(header => `<th>${header.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${tableData.map(item => `
              <tr>
                ${headers.map(header => {
                  let value = item[header];
                  // Handle nested objects
                  if (value && typeof value === 'object' && !Array.isArray(value)) {
                    value = JSON.stringify(value);
                  }
                  // Handle arrays
                  else if (Array.isArray(value)) {
                    value = value.join(', ');
                  }
                  // Handle null/undefined
                  else if (value === null || value === undefined) {
                    value = '';
                  }
                  return `<td>${value}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <script>
          // After content loads, trigger print dialog
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
    </html>
  `;

  // Write the HTML content to the new window
  pdfWindow.document.open();
  pdfWindow.document.write(htmlContent);
  pdfWindow.document.close();
};



  const handleExport = (exportType) => {
    const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
    const apiUrl = `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/reporting/bookings`;
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${apiUrl}?${queryParams}&export_type=${exportType}`;

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          if (exportType === "pdf") {
            exportPDF(data.base64);
          } else if (exportType === "csv") {
            exportCSV(data.base64);
          }
        } else {
          console.error("Export failed", data.message);
        }
      })
      .catch((error) => console.error("Error fetching export data", error));
  };

  const exportPDF = (base64Data) => {
    const pdfData = atob(base64Data);
    const blob = new Blob([pdfData], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'report.pdf';
    link.click();
  };

  const exportCSV = (base64Data) => {
    const csvData = atob(base64Data);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'report.csv';
    link.click();
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
        <div className="filter-row">
          <div className="filter-item">
            <label>Month Duration :</label>
            <select name="month_duration" value={filters.month_duration} onChange={handleChange}>
              <option value="">Select Duration</option>
              <option value="1">1 Month</option>
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
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
            <label>Payment Mode :</label>
            <select name="payment_mode" value={filters.payment_mode} onChange={handleChange}>
              <option value="">Select Payment Mode</option>
              <option value="cash">Cash</option>
              <option value="online">Online</option>
            </select>
          </div>
          <div className="filter-item">
            <label>Payment Status :</label>
            <select name="payment_status" value={filters.payment_status} onChange={handleChange}>
              <option value="">Select Payment Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-item">
            <label>Customer/Partner :</label>
            <select name="user_type" value={filters.user_type} onChange={handleChange} style={{width:"50%"}}>
              <option value="">Select Type</option>
              <option value="customer">Customer</option>
              <option value="partner">Partner</option>
            </select>
          </div>
        </div>
        <div className="filter-buttons">
          <button type="button" onClick={() => handleDownloadPdf("pdf")} className="Discount-btn">
            Export to PDF
          </button>
          <button type="button" onClick={() => handleExport("csv")} className="Discount-btn">
            Export to CSV
          </button>
          <button type="button" onClick={handleSearch} className="Discount-btn">
            Search
          </button>
          <button type="button" onClick={handleClearFilters} className="Discount-btn">
            Clear Filter
          </button>
        </div>
      </form>
      <hr />
    </div>
  );
};

export default ReportingFilters;