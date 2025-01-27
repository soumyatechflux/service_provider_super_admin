// import React, { useState } from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   LineElement,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Line } from 'react-chartjs-2';
// import Select from 'react-select';
// import { saveAs } from 'file-saver';

// // Register the components
// ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

// const CommissionGraph = () => {
//   const [timeRange, setTimeRange] = useState('daily');

//   const options = {
//     scales: {
//       x: {
//         type: 'category',
//         labels: [10, 50, 100, 200, 300, 400, 500],  // Extended data for x-axis
//         title: {
//           display: true,
//           text: 'Units Sold',
//         },
//       },
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Commission (in Rupees)',
//         },
//       },
//     },
//   };

//   const data = {
//     labels: [10, 50, 100, 200, 300, 400, 500],  // Extended data for x-axis
//     datasets: [
//       {
//         label: 'Commission',
//         data: [200, 1000, 2500, 5000, 6000, 7000, 8000], // Corresponding data for y-axis (Commission)
//         borderColor: 'rgba(0, 123, 255, 1)', // Blue color for the border
//         backgroundColor: 'rgba(0, 123, 255, 0.2)', // Light blue color for the fill
//         fill: true,
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
//     const chart = document.getElementById('commission-chart').toDataURL('image/png');
//     if (format === 'pdf') {
//       // Implement PDF export logic here
//     } else if (format === 'excel') {
//       // Implement Excel export logic here
//     }
//   };

//   return (
//     <div style={{ border: '2px solid #ccc', borderRadius: '8px', padding: '20px', marginTop: '20px' }}>
//       <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Commission Graph</h2>
//       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//         <div>
//           <button onClick={() => handleExport('pdf')} style={{ marginRight: '10px' }}>Export to PDF</button>
//           <button onClick={() => handleExport('excel')}>Export to Excel</button>
//         </div>
//         <Select
//           options={timeRangeOptions}
//           value={timeRangeOptions.find((option) => option.value === timeRange)}
//           onChange={(selectedOption) => setTimeRange(selectedOption.value)}
//           placeholder="Select Time Range"
//         />
//       </div>

//       {/* Wrapping the chart in a scrollable container */}
//       <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
//         <Line id="commission-chart" data={data} options={options} />
//       </div>
//     </div>
//   );
// };

// export default CommissionGraph;




import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Select from "react-select";
import { saveAs } from "file-saver";
import axios from "axios";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const CommissionGraph = () => {
  const [timeRange, setTimeRange] = useState("today");
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
  const baseUrl =
    process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL;

  const options = {
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text:
            timeRange === "weekly"
              ? `Week ${selectedWeek}`
              : timeRange === "month"
              ? "Weeks 1-4"
              : "Commission (in units)",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Rupees",
        },
      },
    },
  };

  const timeRangeOptions = [
    { value: "today", label: "Today" },
    { value: "weekly", label: "Weekly" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const weekOptions = [
    { value: 1, label: "Week 1" },
    { value: 2, label: "Week 2" },
    { value: 3, label: "Week 3" },
    { value: 4, label: "Week 4" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Remove the year parameter from the API URL
        let apiUrl = `${baseUrl}/api/admin/dashboard/commision`; // No year parameter

        // Add time range and week/month conditions
        if (timeRange === "today") {
          apiUrl += `?timeRange=today`;
        } else if (timeRange === "weekly") {
          apiUrl += `?timeRange=weekly&week=${selectedWeek}`;
        } else if (timeRange.match(/^\d+$/)) {
          apiUrl += `?month=${timeRange}`;
        }

        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { data } = response.data;

        if (timeRange === "today") {
          // Handle "Today" data
          const todayCommission = data[0] ? parseFloat(data[0].commission) : 0; // Get today's Commission value

          setChartData({
            labels: [""], // No labels for today, just one point in the center
            datasets: [
              {
                label: "Commission Today",
                data: [todayCommission], // Commission for today
                borderColor: "rgba(0, 123, 255, 1)",
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                fill: true,
              },
            ],
          });
        } else if (timeRange === "weekly") {
          // Handle "Weekly" data (display days on x-axis, Sunday to Saturday)
          const allDaysOfWeek = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];

          const processedData = allDaysOfWeek.map((dayName) => {
            const dayData = data.find((day) => day.day_name === dayName);
            return {
              label: dayName, // Day name for the x-axis
              data: dayData ? parseFloat(dayData.commission) : 0, // Default Commission to 0 if no data
            };
          });

          setChartData({
            labels: processedData.map((day) => day.label),
            datasets: [
              {
                label: `Commission for Week ${selectedWeek}`,
                data: processedData.map((day) => day.data),
                borderColor: "rgba(0, 123, 255, 1)",
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                fill: true,
              },
            ],
          });
        } else if (timeRange.match(/^\d+$/)) {
          // Handle "Monthly" data (display Commission for weeks of the month)
          const totalWeeks = 4; // Assuming 4 weeks in a month
          const processedData = Array.from(
            { length: totalWeeks },
            (_, index) => {
              const weekNumber = index + 1;
              const weekData = data.find(
                (week) => week.week_number === weekNumber
              );
              return {
                label: `Week ${weekNumber}`,
                data: weekData ? parseFloat(weekData.commission) : 0,
              };
            }
          );

          setChartData({
            labels: processedData.map((week) => week.label),
            datasets: [
              {
                label: `Commission in ${
                  timeRangeOptions.find((opt) => opt.value === timeRange)?.label
                }`,
                data: processedData.map((week) => week.data),
                borderColor: "rgba(0, 123, 255, 1)",
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                fill: true,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching Commission data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, selectedWeek]);

  const handleExport = async (format) => {
    setLoading(true);

    try {
      let apiUrl = `${baseUrl}/api/admin/dashboard/commision`; // No year parameter

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
        link.download = `export.${exportType}`; // Use export type as file extension (csv or pdf)
        link.click(); // Trigger the download
      } else {
        console.error("Export failed:", message);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
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
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Commission Graph</h2>
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
          onChange={(selectedOption) => setTimeRange(selectedOption.value)}
          placeholder="Select Time Range"
        />
        {timeRange === "weekly" && (
          <Select
            options={weekOptions}
            value={weekOptions.find((option) => option.value === selectedWeek)}
            onChange={(selectedOption) => setSelectedWeek(selectedOption.value)}
            placeholder="Select Week"
          />
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ overflowX: "auto", maxWidth: "100%" }}>
          <Line id="commission-chart" data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default CommissionGraph;
