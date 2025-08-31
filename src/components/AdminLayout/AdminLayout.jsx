import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../sidebar/Sidebar.jsx'

const AdminLayout = () => {
   const isopen = false;
  return (
    <div className="d-flex container-fluid"> 
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-grow-1 p-4 sidebar" style={{ marginLeft: !isopen ? "240px" : "0", transition: "margin-left 0.3s" }}>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout