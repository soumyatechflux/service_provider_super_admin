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

// const SalesGraph = () => {
//   const [timeRange, setTimeRange] = useState('daily');

//   const options = {
//     scales: {
//       x: {
//         type: 'category',
//         labels: [10, 50, 100, 200, 300, 400, 500],  // Extended data for x-axis
//         title: {
//           display: true,
//           text: 'Sales (in units)',
//         },
//       },
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Rupees',
//         },
//       },
//     },
//   };

//   const data = {
//     labels: [10, 50, 100, 200, 300, 400, 500],  // Extended data for x-axis
//     datasets: [
//       {
//         label: 'Sales',
//         data: [1000, 5000, 10000, 20000, 25000, 30000, 35000], // Corresponding data for y-axis
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
//     const chart = document.getElementById('sales-chart').toDataURL('image/png');
//     if (format === 'pdf') {
//       // Implement PDF export logic here
//     } else if (format === 'excel') {
//       // Implement Excel export logic here
//     }
//   };

//   return (
//     <div style={{ border: '2px solid #ccc', borderRadius: '8px', padding: '20px', marginTop: '20px' }}>
//       <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sales Graph</h2>
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
//         <Line id="sales-chart" data={data} options={options} />
//       </div>
//     </div>
//   );
// };

// export default SalesGraph;


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

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const SalesGraph = () => {
  const [timeRange, setTimeRange] = useState("today");
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
  const baseUrl = process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL;

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
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: timeRange === "weekly" ? `Week ${selectedWeek}` : "Sales (in units)",
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let apiUrl = `${baseUrl}/api/admin/dashboard/sales`;
  
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
  
        if (timeRange === "today") {
          const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          const todayData = data[0] || null;
          const todayName = todayData ? todayData.day_name : new Date().toLocaleDateString("en-US", { weekday: "long" });
          const todayAmount = todayData ? todayData.sales : 0;
  
          const dayData = allDays.map((day) => (day === todayName ? todayAmount : 0));
  
          setChartData({
            labels: allDays,
            datasets: [
              {
                label: "Sales Today",
                data: dayData,
                borderColor: "rgba(0, 123, 255, 1)",
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                fill: true,
              },
            ],
          });
        } else if (timeRange === "weekly") {
          const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          const dayData = data.reduce((acc, item) => {
            acc[item.day_name] = item.sales;
            return acc;
          }, {});
  
          const dayLabels = allDays;
          const salesAmounts = allDays.map((day) => dayData[day] || 0);
  
          setChartData({
            labels: dayLabels,
            datasets: [
              {
                label: `Sales for Week ${selectedWeek}`,
                data: salesAmounts,
                borderColor: "rgba(0, 123, 255, 1)",
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                fill: true,
              },
            ],
          });
        } else {
          // Ensure maxWeekNumber is always valid
          const maxWeekNumber = data.length > 0 ? Math.max(...data.map((item) => item.week_number)) : 4; // Default to 4 weeks if no data
  
          // Create labels for each week in the month (Week 1, Week 2, etc.)
          const weekLabels = Array.from({ length: maxWeekNumber }, (_, i) => `Week ${i + 1}`);
  
          // Initialize sales data array with 0 for all weeks
          const weekData = Array(maxWeekNumber).fill(0);
  
          // Populate the sales data for existing weeks
          data.forEach((item) => {
            weekData[item.week_number - 1] = parseFloat(item.sales); // Ensure correct index (0-based)
          });
  
          // Update the chart with the sales data
          setChartData({
            labels: weekLabels,
            datasets: [
              {
                label: `Sales for ${timeRangeOptions.find((opt) => opt.value === timeRange)?.label || "Selected Month"}`,
                data: weekData,
                borderColor: "rgba(0, 123, 255, 1)",
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                fill: true,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [timeRange, selectedWeek]);
  

  const handleExport = async (format) => {
    setLoading(true);

    try {
      let apiUrl = `${baseUrl}/api/admin/dashboard/sales`;

      if (timeRange === "today") {
        apiUrl += `?timeRange=today`;
      } else if (timeRange === "weekly") {
        apiUrl += `?timeRange=weekly&week=${selectedWeek}`;
      } else if (timeRange.match(/^\d+$/)) {
        apiUrl += `?month=${timeRange}`;
      }

      apiUrl += `&exportType=${format}`;

      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { success, message, exportType, base64 } = response.data;

      if (success) {
        const decodedData = atob(base64);
        const blob = new Blob(
          [new Uint8Array([...decodedData].map((char) => char.charCodeAt(0)))],
          {
            type: exportType === "csv" ? "text/csv" : "application/pdf",
          }
        );

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `sales_export.${exportType}`;
        link.click();
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
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Sales Graph</h2>
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
          <Line id="sales-chart" data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default SalesGraph;