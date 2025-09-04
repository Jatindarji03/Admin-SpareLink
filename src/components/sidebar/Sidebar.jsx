import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaBox,
  FaClipboardList,
  FaPlus,
  FaUser,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // Sidebar toggle
  const [isManageOpen, setIsManageOpen] = useState(false); // Collapse/Expand toggle

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-primary position-fixed top-0 start-0 m-3"
        style={{ zIndex: 1050 }}
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar */}
      {isOpen && (
        <div
          className="bg-dark text-white vh-100 position-fixed top-0 start-0 p-3 transition-all"
          style={{ width: "250px", zIndex: 1040 }}
        >
          <h4 className="fw-bold border-bottom pb-3 mb-3 mt-5">Admin Panel</h4>

          <nav className="nav flex-column gap-2">
            <Link
              to="/admin/dashboard"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <FaBox /> Dashboard
            </Link>
            <Link
              to="/admin/spareparts"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <FaClipboardList /> Spare Parts
            </Link>

            {/* Manage Products Section */}
            <div>
              <button
                className="btn btn-link text-white text-start w-100 d-flex justify-content-between align-items-center"
                onClick={() => setIsManageOpen(!isManageOpen)}
              >
                <span className="d-flex align-items-center gap-2 d-flex">
                  <FaClipboardList />Product Management
                </span>
                {isManageOpen ? <FaChevronDown /> : <FaChevronRight />}
              </button>

              {/* Submenu */}
              {isManageOpen && (
                <div className="ms-4 d-flex flex-column gap-2">
                  <Link
                    to="/admin/category"
                    className="nav-link text-white d-flex align-items-center gap-2"
                  >
                    <FaPlus /> Category
                  </Link>
                  <Link
                    to="/admin/brand"
                    className="nav-link text-white d-flex align-items-center gap-2"
                  >
                    <FaPlus /> Brand
                  </Link>
                  <Link
                    to="/admin/model"
                    className="nav-link text-white d-flex align-items-center gap-2"
                  >
                    <FaPlus /> Model
                  </Link>
                  <Link
                    to="/admin/variant"
                    className="nav-link text-white d-flex align-items-center gap-2"
                  >
                    <FaPlus /> Variant
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/admin/orders"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <FaClipboardList /> Requests
            </Link>
            <Link
              to="/admin/profile"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <FaUser /> User Mangement
            </Link>
            <Link
              to="/admin/quotation"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <FaClipboardList /> Supplier Management
            </Link>
            <Link
              to="/admin/quotation"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <FaClipboardList /> anaylytics stats
            </Link>
            
          </nav>
        </div>
      )}
    </>
  );
};

export default Sidebar;
