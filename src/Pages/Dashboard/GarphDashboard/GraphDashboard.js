import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import './GraphDashboard.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Graph_Dashboard = () => {
  // State to manage the selected time range
  const [timeRange, setTimeRange] = useState('12 Months');

  // Data for different time ranges
  const dataForTimeRange = {
    '12 Months': {
      labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
      datasets: [
        {
          label: 'Dataset 1',
          borderColor: '#4F46E5',
          data: [65, 59, 90, 81, 56, 55, 40, 70, 65, 80, 85, 95],
          tension: 0.3,
          fill: true,
        },
        {
          label: 'Dataset 2',
          borderColor: '#818CF8',
          data: [45, 49, 70, 61, 46, 75, 50, 60, 55, 70, 75, 85],
          tension: 0.3,
          fill: true,
        },
      ],
    },
    '6 Months': {
      labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Dataset 1',
          borderColor: '#4F46E5',
          data: [40, 55, 70, 85, 100, 115],
          tension: 0.3,
          fill: true,
        },
        {
          label: 'Dataset 2',
          borderColor: '#818CF8',
          data: [30, 60, 80, 70, 90, 105],
          tension: 0.3,
          fill: true,
        },
      ],
    },
    '30 Days': {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Dataset 1',
          borderColor: '#4F46E5',
          data: [30, 45, 50, 60],
          tension: 0.3,
          fill: true,
        },
        {
          label: 'Dataset 2',
          borderColor: '#818CF8',
          data: [25, 50, 55, 65],
          tension: 0.3,
          fill: true,
        },
      ],
    },
    '7 Days': {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'],
      datasets: [
        {
          label: 'Dataset 1',
          borderColor: '#4F46E5',
          data: [10, 25, 35, 40, 50, 60, 70],
          tension: 0.3,
          fill: true,
        },
        {
          label: 'Dataset 2',
          borderColor: '#818CF8',
          data: [15, 30, 40, 45, 55, 65, 75],
          tension: 0.3,
          fill: true,
        },
      ],
    },
  };
  
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hides the entire legend
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: false, // Ensures that all labels are displayed
          maxRotation: 0, // Rotate labels if necessary to fit them
          minRotation: 0, // Rotate labels if necessary to fit them
          maxTicksLimit: undefined, // Remove or set to undefined to avoid limiting ticks
        },
      },
      y: {
        ticks: {
          display: false, // Removes Y-axis numbering
          maxTicksLimit: 4,
        },
        grid: {
          display: true,
        },
        
      },
    },
  };
  
  return (
    <div className="container mt-5">
      <div className="container_Graph_D">
        <div className="container_Graph_Dashboard">

          {/* Time Range Buttons */}
          <div className="MainHeading-Graph mb-4">
          <h2 className="SalesReport_Graph_Dashboard">Sales Report</h2>
            <button
              className={`custom-btn mx-2 ${timeRange === '12 Months' ? 'active' : ''}`}
              onClick={() => setTimeRange('12 Months')}
            >
              12 Months
            </button>
            <button
              className={`custom-btn mx-2 ${timeRange === '6 Months' ? 'active' : ''}`}
              onClick={() => setTimeRange('6 Months')}
            >
              6 Months
            </button>
            <button
              className={`custom-btn mx-2 ${timeRange === '30 Days' ? 'active' : ''}`}
              onClick={() => setTimeRange('30 Days')}
            >
              30 Days
            </button>
            <button
              className={`custom-btn mx-2 ${timeRange === '7 Days' ? 'active' : ''}`}
              onClick={() => setTimeRange('7 Days')}
            >
              7 Days
            </button>

            <button className="ExportPdf-btn mx-2">
                <img src='./assets/images/Dashboard/ExportPdf.png' alt=''/> Export PDF
              </button>
          </div>

          {/* Line Chart */}
          <div style={{ width: '100%', height: '200px' }}>
            <Line data={dataForTimeRange[timeRange]} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graph_Dashboard;
