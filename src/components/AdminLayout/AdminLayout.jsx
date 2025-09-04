import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar.jsx";

const AdminLayout = () => {
  const isopen = false;

  return (
    <div className="d-flex container-fluid p-0">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main
        className="flex-grow-1  sidebar"
        style={{
          marginLeft: !isopen ? "250px" : "0",
          transition: "margin-left 0.3s",
          minWidth: 0,
        }}
      >
        <div className="container-fluid">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
