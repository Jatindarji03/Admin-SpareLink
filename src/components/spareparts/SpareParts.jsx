import React, { useState, useEffect } from "react";
import axiosInstance, { BASE_URL } from "../../utils/axiosInstance.js";
import AOS from "aos";
import "aos/dist/aos.css";

const SpareParts = () => {
  // States
  const [categories, setCategories] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPart, setSelectedPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Init AOS
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

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

        // ✅ Unique categories with "All" first
        const uniqueCategories = [
          { _id: "all", name: "All" },
          ...new Map(rawCategories.map((cat) => [cat.name, cat])).values(),
        ];

        // ✅ Unique products by name
        const uniqueProducts = [
          ...new Map(rawProducts.map((prod) => [prod.name, prod])).values(),
        ];

        setCategories(uniqueCategories);
        setSpareParts(uniqueProducts);

        // Default active tab = "All"
        setActiveTab("All");
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

  const filteredParts = spareParts.filter((part) => {
    const matchesSearch = part.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (activeTab === "All") return matchesSearch;
    return part.categoryId?._id === activeCategory?._id && matchesSearch;
  });

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-1" data-aos="fade-down">
        Spare Parts Inventory
      </h3>

      {/* Search */}
      <div className="row mb-2">
        <div className="col-md-6" data-aos="zoom-in">
          <input
            type="text"
            className="form-control form-control-lg shadow-sm my-2"
            placeholder="🔍 Search spare parts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <ul
        className="nav nav-tabs justify-content-center mb-4"
        data-aos="zoom-in"
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
      </ul>

      {/* Spare Parts Grid */}
      <div className="row g-4">
        {loading ? (
          <p className="text-center text-muted">Loading...</p>
        ) : filteredParts.length > 0 ? (
          filteredParts.map((part, index) => (
            <div
              className="col-sm-6 col-lg-3"
              key={part._id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="card h-100 shadow-sm border-0 rounded-3">
                <div className="card-body d-flex flex-column">
                  <img
                    src={`${BASE_URL}${part.image}`}
                    alt={part.name}
                    className="img-fluid rounded"
                    style={{
                      objectFit: "contain",
                      height: "140px", // fixed height
                      width: "100%", // takes full card width
                    }}
                  />
                  <h5 className="card-title fw-semibold">{part.name}</h5>
                  <p className="card-text mb-3">
                    <span className="d-block">
                      <strong>Category:</strong> {part.categoryId?.name}
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
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No spare parts found.</p>
        )}
      </div>

      {/* Controlled Modal */}
      {showModal && selectedPart && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          data-aos="zoom-in"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{selectedPart.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Category:</strong> {selectedPart.categoryId?.name}
                </p>
                <p>
                  <strong>Price:</strong> ₹{selectedPart.price}
                </p>
                <p>
                  <strong>Description:</strong> {selectedPart.description}
                </p>
                <p>
                  <strong>Specifications:</strong> {selectedPart.specifications}
                </p>

                <h6 className="mt-4 fw-bold">Suppliers</h6>
                {selectedPart.suppliersId?.length > 0 ? (
                  <ul className="list-group">
                    {selectedPart.suppliersId.map((sup, idx) => (
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpareParts;
