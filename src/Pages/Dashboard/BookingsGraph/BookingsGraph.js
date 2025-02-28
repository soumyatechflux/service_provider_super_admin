// import React, { useState } from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Bar } from 'react-chartjs-2';
// import Select from 'react-select';
// import { saveAs } from 'file-saver';

// // Register the components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const BookingsGraph = () => {
//   const [timeRange, setTimeRange] = useState('daily');

//   const options = {
//     scales: {
//       x: {
//         type: 'category',
//         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],  // Example months
//         title: {
//           display: true,
//           text: 'Month',
//         },
//       },
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Bookings Count',
//         },
//       },
//     },
//   };

//   const data = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],  // Example months
//     datasets: [
//       {
//         label: 'Cook',
//         data: [10, 20, 30, 40, 50, 60, 70], // Cook bookings
//         borderColor: '#123499', // Dark Blue for Cook
//         backgroundColor: '#123499', // Light dark blue for fill
//       },
//       {
//         label: 'Driver',
//         data: [5, 10, 15, 20, 25, 30, 35], // Driver bookings
//         borderColor: '#4895EF', // Blue for Driver
//         backgroundColor: '#4895EF', // Light blue for fill
//       },
//       {
//         label: 'Gardener',
//         data: [3, 6, 9, 12, 15, 18, 21], // Gardener bookings
//         borderColor: '#b4d4f8', // Orange for Gardener
//         backgroundColor: '#b4d4f8', // Light orange for fill
//       },
//     ],
//   };

//   const timeRangeOptions = [
//     { value: 'daily', label: 'Daily' },
//     { value: 'weekly', label: 'Weekly' },
//     { value: '6months', label: '6 Months' },
//     { value: 'january', label: 'January' },
//     { value: 'february', label: 'February' },
//     { value: 'march', label: 'March' },
//     { value: 'april', label: 'April' },
//     { value: 'may', label: 'May' },
//     { value: 'june', label: 'June' },
//     { value: 'july', label: 'July' },
//     { value: 'august', label: 'August' },
//     { value: 'september', label: 'September' },
//     { value: 'october', label: 'October' },
//     { value: 'november', label: 'November' },
//     { value: 'december', label: 'December' },
//   ];

//   const handleExport = (format) => {
//     const chart = document.getElementById('bookings-chart').toDataURL('image/png');
//     if (format === 'pdf') {
//       // Implement PDF export logic here
//     } else if (format === 'excel') {
//       // Implement Excel export logic here
//     }
//   };

//   return (
//     <div style={{ border: '2px solid #ccc', borderRadius: '8px', padding: '20px', marginTop: '20px' }}>
//       <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Bookings Graph</h2>
//       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//         <div>
//           <button
//             onClick={() => handleExport('pdf')}
//             style={{
//               marginRight: '10px',
//               padding: '10px 20px',
//               borderRadius: '4px',
//               cursor: 'pointer',
//             }}
//           >
//             Export to PDF
//           </button>
//           <button
//             onClick={() => handleExport('excel')}
//             style={{
//               padding: '10px 20px',
//               borderRadius: '4px',
//               cursor: 'pointer',
//             }}
//           >
//             Export to Excel
//           </button>
//         </div>
//         <Select
//           options={timeRangeOptions}
//           value={timeRangeOptions.find((option) => option.value === timeRange)}
//           onChange={(selectedOption) => setTimeRange(selectedOption.value)}
//           placeholder="Select Time Range"
//           styles={{
//             control: (styles) => ({
//               ...styles,
//               borderColor: '#ccc',
//             }),
//             option: (styles) => ({
//               ...styles,
//               color: '#333',
//               padding: '10px',
//             }),
//           }}
//         />
//       </div>

//       {/* Wrapping the chart in a scrollable container */}
//       <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
//         <Bar id="bookings-chart" data={data} options={options} />
//       </div>
//     </div>
//   );
// };

// export default BookingsGraph;




import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Select from "react-select";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BookingsGraph = () => {
  const [timeRange, setTimeRange] = useState("today");
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
  const baseUrl =
    process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL;

  const timeRangeOptions = [
    { value: "today", label: "Today" },
    { value: "weekly", label: "Weekly" },
    ...Array.from({ length: 12 }, (_, i) => ({
      value: (i + 1).toString(),
      label: new Date(0, i).toLocaleString("default", { month: "long" }),
    })),
  ];

  const weekOptions = [
    { value: 1, label: "Week 1" },
    { value: 2, label: "Week 2" },
    { value: 3, label: "Week 3" },
    { value: 4, label: "Week 4" },
  ];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            family: "'Roboto', sans-serif", // Use a custom font
          },
          color: "#333", // Change legend text color
        },
      },
      title: {
        display: true,
        font: {
          size: 20,
          weight: "bold",
          family: "'Poppins', sans-serif",
        },
        color: "#007bff", // Title color
      },
      tooltip: {
        backgroundColor: "#f9f9f9", // Tooltip background
        borderColor: "#ccc", // Tooltip border
        borderWidth: 1,
        titleFont: {
          size: 16,
          weight: "bold",
        },
        bodyFont: {
          size: 14,
        },
        bodyColor: "#333",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: timeRange === "weekly" ? `Week ${selectedWeek}` : "Weeks",
          font: {
            size: 16,
            weight: "500",
            family: "'Poppins', sans-serif",
          },
          color: "#555",
        },
        grid: {
          display: false, // Remove gridlines for the x-axis
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Bookings",
          font: {
            size: 16,
            weight: "500",
            family: "'Poppins', sans-serif",
          },
          color: "#555",
        },
        grid: {
          color: "rgba(200, 200, 200, 0.2)", // Subtle gridline color
          borderDash: [5, 5], // Dashed gridlines
        },
      },
    },
    animation: {
      duration: 1000, // Animation duration in milliseconds
      easing: "easeInOutQuad", // Animation easing
    },
    elements: {
      bar: {
        backgroundColor: (context) => {
          // Apply gradient color
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "#007bff");
          gradient.addColorStop(1, "#00c6ff");
          return gradient;
        },
        borderRadius: 10, // Round the corners of bars
        borderWidth: 1,
        borderColor: "#007bff",
      },
    },
  };
  

  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
  
    try {
      let apiUrl = `${baseUrl}/api/admin/dashboard/bookings`;
  
      if (timeRange === "today") {
        apiUrl += `?today=true`;
      } else if (timeRange === "weekly") {
        apiUrl += `?timeRange=weekly&week=${selectedWeek}`;
      } else {
        apiUrl += `?month=${timeRange}`;
      }
  
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { data } = response.data;

      if (!data || data.length === 0) {
        setChartData({ labels: [], datasets: [] }); // Set empty data to trigger "No Data Available"
        return;
      }
  
      if (timeRange === "today") {
        const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const todayData = data[0] || null;
        const todayName = todayData ? todayData.day_name : new Date().toLocaleDateString("en-US", { weekday: "long" });
        const todayCount = todayData ? todayData.booking_count : 0;
  
        const dayData = allDays.map((day) => (day === todayName ? todayCount : 0));
  
        setChartData({
          labels: allDays,
          datasets: [
            {
              label: "Bookings Today",
              data: dayData,
              backgroundColor: "rgba(0, 123, 255, 0.6)",
            },
          ],
        });
      } else if (timeRange === "weekly") {
        const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayData = data.reduce((acc, item) => {
          acc[item.day_name] = item.booking_count;
          return acc;
        }, {});
  
        setChartData({
          labels: allDays,
          datasets: [
            {
              label: `Bookings for Week ${selectedWeek}`,
              data: allDays.map((day) => dayData[day] || 0),
              backgroundColor: "rgba(0, 123, 255, 0.6)",
            },
          ],
        });
      } else {
        const maxWeekNumber = Math.max(...data.map((item) => item.week_number));
        const weekLabels = Array.from({ length: maxWeekNumber }, (_, i) => `Week ${i + 1}`);
        const weekData = Array(maxWeekNumber).fill(0);
  
        data.forEach((item) => {
          weekData[item.week_number - 1] = item.booking_count;
        });
  
        setChartData({
          labels: weekLabels,
          datasets: [
            {
              label: `Bookings for ${timeRangeOptions.find((opt) => opt.value === timeRange)?.label}`,
              data: weekData,
              backgroundColor: "rgba(0, 123, 255, 0.6)",
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching bookings data:", error);
      setChartData({ labels: [], datasets: [] }); // Show "No Data Available" in case of an error
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [timeRange, selectedWeek]);


  const handleExport = async (format) => {
    setLoading(true);
  
    try {
      let apiUrl = `${baseUrl}/api/admin/dashboard/bookings`; // Updated to point to bookings API
  
      // Add time range and week or month parameters
      if (timeRange === "today") {
        apiUrl += `?timeRange=today`;
      } else if (timeRange === "weekly") {
        apiUrl += `?timeRange=weekly&week=${selectedWeek}`;
      } else if (timeRange.match(/^\d+$/)) {
        apiUrl += `?month=${timeRange}`;
      }
  
      // Add export type parameter (csv, excel, or pdf)
      apiUrl += `&exportType=${format}`;
  
      // Make the API request for export data
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const { success, message, exportType, base64 } = response.data;
  
      // If export is successful, handle the base64 response
      if (success) {
        // Decode the base64 string to binary data
        const decodedData = atob(base64);
  
        // Convert the decoded data into a Blob (binary large object)
        const blob = new Blob(
          [new Uint8Array([...decodedData].map((char) => char.charCodeAt(0)))],
          {
            type: exportType === "csv" ? "text/csv" : "application/pdf", // Adjust MIME type based on export type
          }
        );
  
        // Create a link to trigger the file download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `bookings_export.${exportType}`; // Use export type as file extension (csv or pdf)
        link.click(); // Trigger the download
      } else {
        console.error("Export failed:", message);
      }
    } catch (error) {
      console.error("Error exporting bookings data:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div
      style={{
        border: "2px solid #ccc",
        borderRadius: "8px",
        padding: "20px",
        marginTop: "20px",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Bookings Graph
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div>
          <button
            onClick={() => handleExport("pdf")}
            style={{ marginRight: "10px" }}
          >
            Export to PDF
          </button>
          <button onClick={() => handleExport("csv")}>Export to CSV</button>
        </div>
        <Select
          options={timeRangeOptions}
          value={timeRangeOptions.find((option) => option.value === timeRange)}
          onChange={(option) => setTimeRange(option.value)}
          placeholder="Select Time Range"
        />
        {timeRange === "weekly" && (
          <Select
            options={weekOptions}
            value={weekOptions.find((option) => option.value === selectedWeek)}
            onChange={(option) => setSelectedWeek(option.value)}
            placeholder="Select Week"
          />
        )}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default BookingsGraph;