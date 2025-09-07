import React,{useState} from "react";
import { Bar, Pie, Line, Doughnut, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
} from "chart.js";
import axiosInstance from "../../utils/axiosInstance";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
);

const Dashboard = () => {
  const colors=["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

    const [activeTab, setActiveTab] = useState("lastMonth");
    const [category, setCategory] = useState([]);
  // ---------------- Revenue Data ----------------
  // get category
  const getCategories = async () => {
    try {
      const response = await axiosInstance.get("api/category/get-category");
      const data = await response.data.data;

      setCategory(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  React.useEffect(() => {
    getCategories();
  }, []);

  const revenueLastMonth = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [12000, 15000, 18000, 22000],
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
    ],
  };

  const revenueLastYear = {
    labels: [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec",
    ],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [50000, 65000, 70000, 55000, 60000, 75000, 80000, 85000, 90000, 95000, 88000, 100000],
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },
    ],
  };

  const revenueCurrentYear = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [60000, 70000, 75000, 80000, 85000, 95000, 100000, 110000, 105000, 120000],
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
    ],
  };
  // ✅ NEW: Overall till now revenue
  const revenueOverall = {
    labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [300000, 400000, 450000, 600000, 700000, 850000],
        backgroundColor: "rgba(153, 102, 255, 0.7)",
      },
    ],
  };
  // ---------------- Spare Parts Data ----------------
  const sparePartsCategory = {
    labels: category.map((cat) => cat.name),
    datasets: [
      {
        data: [40, 25, 15],
        backgroundColor: colors.slice(0, category.length),
        hoverBackgroundColor: colors.slice(0, category.length).map(color => color.replace("0.7", "0.9")),
      },
    ],
  };

  const topSpareParts = {
    labels: ["Brake Pads", "Tyres", "Oil Filter", "Clutch Plate", "Headlight"],
    datasets: [
      {
        label: "Units Sold",
        data: [500, 420, 380, 350, 300],
        backgroundColor: "rgba(255, 159, 64, 0.7)",
      },
    ],
  };

//   // ---------------- Supplier & Quotation Data ----------------
//   const quotations = {
//     labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"],
//     datasets: [
//       {
//         label: "Accepted",
//         data: [40, 50, 45, 60, 55, 70, 65, 80, 75, 90],
//         borderColor: "rgba(75, 192, 192, 1)",
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//       },
//       {
//         label: "Rejected",
//         data: [10, 15, 12, 20, 18, 25, 20, 30, 25, 28],
//         borderColor: "rgba(255, 99, 132, 1)",
//         backgroundColor: "rgba(255, 99, 132, 0.2)",
//       },
//     ],
//   };

//   const suppliers = {
//     labels: ["Active", "Inactive"],
//     datasets: [
//       {
//         data: [85, 15],
//         backgroundColor: ["rgba(54, 162, 235, 0.7)", "rgba(201, 203, 207, 0.7)"],
//       },
//     ],
//   };

//   // ---------------- Orders & Customers ----------------
//   const orders = {
//     labels: ["Completed", "Pending", "Cancelled"],
//     datasets: [
//       {
//         label: "Orders",
//         data: [120, 30, 10],
//         backgroundColor: [
//           "rgba(75, 192, 192, 0.7)",
//           "rgba(255, 206, 86, 0.7)",
//           "rgba(255, 99, 132, 0.7)",
//         ],
//       },
//     ],
//   };

//   const customerDemand = {
//     labels: ["Tyres", "Batteries", "Oil", "Filters", "Lights", "Brakes"],
//     datasets: [
//       {
//         label: "Demand Trend",
//         data: [80, 60, 75, 50, 40, 70],
//         backgroundColor: "rgba(153, 102, 255, 0.4)",
//         borderColor: "rgba(153, 102, 255, 1)",
//       },
//     ],
//   };

  const options = { responsive: true, plugins: { legend: { position: "top" } } };

  const getChartData = () => {
    if (activeTab === "lastMonth") return revenueLastMonth;
    if (activeTab === "lastYear") return revenueLastYear;
    if (activeTab === "currentYear") return revenueCurrentYear;
    return revenueOverall;
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4">📊 SpareLink Admin Dashboard</h2>

      <div className="row g-4">
        {/* Revenue Charts */}
        <div className="card p-3 shadow-sm">
      <h5 className="fw-bold">Revenue Overview</h5>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "lastMonth" ? "active" : ""}`}
            onClick={() => setActiveTab("lastMonth")}
          >
            Last Month
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "lastYear" ? "active" : ""}`}
            onClick={() => setActiveTab("lastYear")}
          >
            Last Year
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "currentYear" ? "active" : ""}`}
            onClick={() => setActiveTab("currentYear")}
          >
            Current Year
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "overall" ? "active" : ""}`}
            onClick={() => setActiveTab("overall")}
          >
            Overall
          </button>
        </li>

      </ul>

      {/* Chart */}
      <Bar data={getChartData()} options={options} height={100} />
    </div>

        {/* Spare Parts */}
        <div className="col-md-6"><div className="card p-3 shadow-sm"><h6>Spare Parts by Category</h6><Pie data={sparePartsCategory} options={options} /></div></div>
        <div className="col-md-6"><div className="card p-3 shadow-sm"><h6>Top Spare Parts Sold</h6><Bar data={topSpareParts} options={options} /></div></div>

        {/* Suppliers & Quotations */}
        {/* <div className="col-md-8"><div className="card p-3 shadow-sm"><h6>Quotations Trend</h6><Line data={quotations} options={options} /></div></div> */}
        {/* <div className="col-md-4"><div className="card p-3 shadow-sm"><h6>Suppliers</h6><Doughnut data={suppliers} options={options} /></div></div> */}

        {/* Orders & Customers */}
        {/* <div className="col-md-6"><div className="card p-3 shadow-sm"><h6>Orders Overview</h6><Pie data={orders} options={options} /></div></div> */}
        {/* <div className="col-md-6"><div className="card p-3 shadow-sm"><h6>Customer Demand</h6><Radar data={customerDemand} options={options} /></div></div> */}
      </div>
    </div>
  );
};

export default Dashboard;
