import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import axiosInstance from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { setSpareParts } from "../../Store/Slice/SparePartsSlice";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];
  const [activeTab, setActiveTab] = useState("lastMonth");
  const [category, setCategory] = useState([]);
  const dispatch = useDispatch();
  const spareParts = useSelector((state) => state.spareParts.items);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axiosInstance.get("api/category/get-category");
        setCategory(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const getSpareparts = async () => {
      try {
        const res = await axiosInstance.get("api/spare-part/spare-parts/mechanic");
        if (res.status === 200 && res.data.data) {
          const uniqueProducts = [...new Map(res.data.data.map((prod) => [prod.name, prod])).values()];
          dispatch(setSpareParts(uniqueProducts));
        }
      } catch (error) {
        console.error("Error fetching spare parts:", error);
      }
    };

    getCategories();
    getSpareparts();
  }, [dispatch]);

  // Charts
  const revenueLastMonth = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{ label: "Revenue (₹)", data: [12000, 15000, 18000, 22000], backgroundColor: "rgba(54, 162, 235, 0.7)" }],
  };

  const revenueLastYear = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{ label: "Revenue (₹)", data: [50000, 65000, 70000, 55000, 60000, 75000, 80000, 85000, 90000, 95000, 88000, 100000], backgroundColor: "rgba(255, 99, 132, 0.7)" }],
  };

  const revenueCurrentYear = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    datasets: [{ label: "Revenue (₹)", data: [60000, 70000, 75000, 80000, 85000, 95000, 100000, 110000, 105000, 120000], backgroundColor: "rgba(75, 192, 192, 0.7)" }],
  };

  const revenueOverall = {
    labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
    datasets: [{ label: "Revenue (₹)", data: [300000, 400000, 450000, 600000, 700000, 850000], backgroundColor: "rgba(153, 102, 255, 0.7)" }],
  };

  const categoryCounts = category.map((cat) => spareParts.filter((sp) => sp.categoryId?._id === cat._id).length);

  const sparePartsCategory = {
    labels: category.map((cat) => cat.name),
    datasets: [{ data: categoryCounts, backgroundColor: colors.slice(0, category.length) }],
  };

  const topSpareParts = {
    labels: ["Brake Pads", "Tyres", "Oil Filter", "Clutch Plate", "Headlight"],
    datasets: [{ label: "Units Sold", data: [500, 420, 380, 350, 300], backgroundColor: "rgba(255, 159, 64, 0.7)" }],
  };

  const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top" } } };

  const getChartData = () => {
    if (activeTab === "lastMonth") return revenueLastMonth;
    if (activeTab === "lastYear") return revenueLastYear;
    if (activeTab === "currentYear") return revenueCurrentYear;
    return revenueOverall;
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3 text-lg-start text-center" data-aos="fade-down" >SpareLink Admin Dashboard</h2>

      <div className="row g-4">
        {/* Revenue Charts */}
        <div className="col-12">
          <div className="card p-3 shadow-sm" style={{ minHeight: "400px" }}>
            <h5 className="fw-bold">Revenue Overview</h5>
            <ul className="nav nav-tabs mb-3">
              {["lastMonth", "lastYear", "currentYear", "overall"].map((tab) => (
                <li key={tab} className="nav-item">
                  <button className={`nav-link ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                    {tab === "lastMonth" && "Last Month"}
                    {tab === "lastYear" && "Last Year"}
                    {tab === "currentYear" && "Current Year"}
                    {tab === "overall" && "Overall"}
                  </button>
                </li>
              ))}
            </ul>
            <div style={{ position: "relative", width: "100%", height: "300px" }}>
              <Bar data={getChartData()} options={options} />
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="col-lg-6 col-12">
          <div className="card p-3 shadow-sm" style={{ minHeight: "300px" }}>
            <h6>Spare Parts by Category</h6>
            <div style={{ position: "relative", width: "100%", height: "300px" }}>
              <Pie data={sparePartsCategory} options={options} />
            </div>
          </div>
        </div>

        {/* Top Spare Parts */}
        <div className="col-lg-6 col-12">
          <div className="card p-3 shadow-sm" style={{ minHeight: "300px" }}>
            <h6>Top Spare Parts Sold</h6>
            <div style={{ position: "relative", width: "100%", height: "300px"}}>
              <Bar data={topSpareParts} options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
