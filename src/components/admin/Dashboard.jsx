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
  const [orders, setOrders] = useState([]);
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

    const getOrders = async () => {
      try {
        const response = await axiosInstance.get("api/order/get-order/admin");
        if (response.status === 200 && response.data.data) {
          setOrders(response.data.data);
          console.log(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    getCategories();
    getSpareparts();
    getOrders();
  }, [dispatch]);

  // Helper function to get last month revenue grouped by weeks
  const getLastMonthRevenue = () => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const weeklyData = [0, 0, 0, 0];
    
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      if (orderDate >= lastMonth && orderDate < thisMonth) {
        const weekIndex = Math.floor((orderDate.getDate() - 1) / 7);
        weeklyData[Math.min(weekIndex, 3)] += order.quotationId.product.totalPrice;
      }
    });
    
    return {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [{
        label: "Revenue (₹)",
        data: weeklyData,
        backgroundColor: "rgba(54, 162, 235, 0.7)"
      }]
    };
  };

  // Helper function to get yearly revenue grouped by months
  const getYearlyRevenue = (year) => {
    const monthlyData = Array(12).fill(0);
    
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      if (orderDate.getFullYear() === year) {
        monthlyData[orderDate.getMonth()] += order.quotationId.product.totalPrice;
      }
    });
    
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [{
        label: "Revenue (₹)",
        data: monthlyData,
        backgroundColor: year === new Date().getFullYear() ? 
          "rgba(75, 192, 192, 0.7)" : "rgba(255, 99, 132, 0.7)"
      }]
    };
  };

  // Helper function to get overall revenue grouped by years
  const getOverallRevenue = () => {
    const yearlyTotals = {};
    
    orders.forEach(order => {
      const year = new Date(order.createdAt).getFullYear();
      yearlyTotals[year] = (yearlyTotals[year] || 0) + order.quotationId.product.totalPrice;
    });
    
    const years = Object.keys(yearlyTotals).sort();
    
    return {
      labels: years,
      datasets: [{
        label: "Revenue (₹)",
        data: years.map(year => yearlyTotals[year]),
        backgroundColor: "rgba(153, 102, 255, 0.7)"
      }]
    };
  };

  // Helper function to get top selling spare parts
  const getTopSpareParts = () => {
    const sparePartsSales = {};
    
    orders.forEach(order => {
      const sparePartName = order.quotationId.product.sparePartId.name;
      const quantity = order.quotationId.product.quantity;
      
      if (sparePartsSales[sparePartName]) {
        sparePartsSales[sparePartName] += quantity;
      } else {
        sparePartsSales[sparePartName] = quantity;
      }
    });
    
    // Convert to array and sort by quantity
    const sortedParts = Object.entries(sparePartsSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 5
    
    return {
      labels: sortedParts.map(item => item[0]),
      datasets: [{
        label: "Units Sold",
        data: sortedParts.map(item => item[1]),
        backgroundColor: "rgba(255, 159, 64, 0.7)"
      }]
    };
  };

  // Spare parts by category
  const categoryCounts = category.map((cat) => 
    spareParts.filter((sp) => sp.categoryId?._id === cat._id).length
  );

  const sparePartsCategory = {
    labels: category.map((cat) => cat.name),
    datasets: [{ 
      data: categoryCounts, 
      backgroundColor: colors.slice(0, category.length) 
    }],
  };

  const options = { 
    responsive: true, 
    maintainAspectRatio: false, 
    plugins: { 
      legend: { position: "top" } 
    } 
  };

  // Get chart data based on active tab
  const getChartData = () => {
    const now = new Date();
    
    if (activeTab === "lastMonth") return getLastMonthRevenue();
    if (activeTab === "lastYear") return getYearlyRevenue(now.getFullYear() - 1);
    if (activeTab === "currentYear") return getYearlyRevenue(now.getFullYear());
    return getOverallRevenue();
  };

  // Get top spare parts data
  const topSpareParts = orders.length > 0 ? getTopSpareParts() : {
    labels: ["No Data"],
    datasets: [{ 
      label: "Units Sold", 
      data: [0], 
      backgroundColor: "rgba(255, 159, 64, 0.7)" 
    }]
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3 text-lg-start text-center" data-aos="fade-down">
        SpareLink Admin Dashboard
      </h2>

      <div className="row g-4">
        {/* Revenue Charts */}
        <div className="col-12">
          <div className="card p-3 shadow-sm" style={{ minHeight: "400px" }}>
            <h5 className="fw-bold">Revenue Overview</h5>
            <ul className="nav nav-tabs mb-3">
              {["lastMonth", "lastYear", "currentYear", "overall"].map((tab) => (
                <li key={tab} className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === tab ? "active" : ""}`} 
                    onClick={() => setActiveTab(tab)}
                  >
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
            <div style={{ position: "relative", width: "100%", height: "300px" }}>
              <Bar data={topSpareParts} options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;