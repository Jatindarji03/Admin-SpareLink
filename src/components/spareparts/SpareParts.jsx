import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance, { BASE_URL } from "../../utils/axiosInstance.js";

const SpareParts = () => {
  // States
  const [categories, setCategories] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPart, setSelectedPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, productRes] = await Promise.all([
          axiosInstance.get(`${BASE_URL}api/category/get-category`),
          axiosInstance.get(`${BASE_URL}api/spare-part/spare-parts/mechanic`),
        ]);

        const rawCategories = catRes.data.data || [];
        const rawProducts = productRes.data.data || [];
        console.log("Products:", rawProducts);

        // ✅ Unique categories
        const uniqueCategories = [
          ...new Map(rawCategories.map((cat) => [cat.name, cat])).values(),
        ];

        // ✅ Unique products
        const uniqueProducts = [
          ...new Map(rawProducts.map((prod) => [prod._id, prod])).values(),
        ];

        setCategories(uniqueCategories);
        setSpareParts(uniqueProducts);

        if (rawCategories.length > 0) {
          setActiveTab(rawCategories[0].name);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter parts based on active category + search
 const activeCategory = categories.find((c) => c.name === activeTab);

const filteredParts = spareParts.filter(
  (part) =>{
    // console.log(part)
    return part.categoryId._id === activeCategory?._id &&
    part.name.toLowerCase().includes(searchTerm.toLowerCase())}
);
  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4 text-center">Spare Parts Inventory</h3>

      {/* Search */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control form-control-lg shadow-sm"
            placeholder="🔍 Search spare parts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category Tabs with Motion */}
      <motion.ul
        className="nav nav-tabs justify-content-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {categories.map((cat) => (
          <li key={cat._id} className="nav-item">
            <button
              className={`nav-link ${
                activeTab === cat.name ? "active fw-bold" : ""
              }`}
              onClick={() => setActiveTab(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </motion.ul>

      {/* Spare Parts Grid */}
      <div className="row g-4">
        {loading ? (
          <p className="text-center text-muted">Loading...</p>
        ) : filteredParts.length > 0 ? (
          <AnimatePresence>
            {filteredParts.map((part) => (
              <motion.div
                key={part._id}
                className="col-md-3"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card h-100 shadow-sm border-0 rounded-3">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-semibold">{part.name}</h5>
                    <p className="card-text mb-3">
                      <span className="d-block">
                        <strong>Category:</strong> {part.category?.name}
                      </span>
                      <span className="d-block">
                        <strong>Price:</strong> ₹{part.price}
                      </span>
                    </p>
                    <button
                      className="btn btn-primary mt-auto w-100 rounded-pill"
                      onClick={() => {
                        setSelectedPart(part);
                        setShowModal(true);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <p className="text-center text-muted">No spare parts found.</p>
        )}
      </div>

      {/* Controlled Modal */}
      <AnimatePresence>
        {showModal && selectedPart && (
          <motion.div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <motion.div
                className="modal-content rounded-4 shadow"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    {selectedPart.name}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Category:</strong> {selectedPart.category?.name}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{selectedPart.price}
                  </p>
                  <p>
                    <strong>Stock:</strong> {selectedPart.stock} pcs
                  </p>

                  <h6 className="mt-4 fw-bold">Suppliers</h6>
                  {selectedPart.suppliers?.length > 0 ? (
                    <ul className="list-group">
                      {selectedPart.suppliers.map((sup, idx) => (
                        <li key={idx} className="list-group-item">
                          <strong>{sup.name}</strong> <br />
                          📞 {sup.contact}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted">No suppliers available</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button type="button" className="btn btn-success rounded-pill">
                    Request Quotation
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpareParts;
