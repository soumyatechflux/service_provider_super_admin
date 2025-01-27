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
      },
      title: {
        display: true,
        text: "Bookings Overview",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: timeRange === "weekly" ? `Week ${selectedWeek}` : "Weeks",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Bookings",
        },
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        let apiUrl = `${baseUrl}/api/admin/dashboard/bookings`;

        // Check if the selected timeRange is "today"
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

        // Handle response for "Today"
        if (timeRange === "today") {
          const todayData = data[0] ? data[0] : null;

          if (todayData) {
            setChartData({
              labels: [todayData.day_name], // Display the day name (e.g., "Monday")
              datasets: [
                {
                  label: "Bookings Today",
                  data: [todayData.booking_count], // Display the booking count for today
                  backgroundColor: "rgba(0, 123, 255, 0.6)", // Blue color
                },
              ],
            });
          } else {
            setChartData({
              labels: ["Today"],
              datasets: [
                {
                  label: "Bookings Today",
                  data: [0], // If no data for today, show 0
                  backgroundColor: "rgba(0, 123, 255, 0.6)", // Blue color
                },
              ],
            });
          }
        } else if (timeRange === "weekly") {
          // Weekly case - Ensure all days are displayed
          const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          const dayData = data.reduce((acc, item) => {
            acc[item.day_name] = item.booking_count;
            return acc;
          }, {});

          const dayLabels = allDays;
          const bookingCounts = allDays.map((day) => dayData[day] || 0);

          setChartData({
            labels: dayLabels,
            datasets: [
              {
                label: `Bookings for Week ${selectedWeek}`,
                data: bookingCounts,
                backgroundColor: "rgba(0, 123, 255, 0.6)", // Blue color
              },
            ],
          });
        } else {
          // Monthly case
          const maxWeekNumber = Math.max(...data.map((item) => item.week_number));
          const weekLabels = Array.from(
            { length: maxWeekNumber },
            (_, i) => `Week ${i + 1}`
          );
          const weekData = Array(maxWeekNumber).fill(0);

          data.forEach((item) => {
            weekData[item.week_number - 1] = item.booking_count;
          });

          setChartData({
            labels: weekLabels,
            datasets: [
              {
                label: `Bookings for ${timeRangeOptions.find(
                  (opt) => opt.value === timeRange
                )?.label}`,
                data: weekData,
                backgroundColor: "rgba(0, 123, 255, 0.6)", // Blue color
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching bookings data:", error);
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