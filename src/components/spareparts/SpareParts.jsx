import React, { useState } from "react";

const SpareParts = () => {
  // Categories
  const categories = ["Engine", "Brakes", "Electrical", "Body"];

  // Dummy spare parts data
  const spareParts = [
    { 
      id: 1, name: "Spark Plug", category: "Engine", price: 250, stock: 50,
      suppliers: [
        { name: "ABC Motors", contact: "9876543210" },
        { name: "AutoZone", contact: "9123456780" },
      ]
    },
    { 
      id: 2, name: "Oil Filter", category: "Engine", price: 400, stock: 30,
      suppliers: [
        { name: "Speed Parts", contact: "8765432109" }
      ]
    },
    { 
      id: 3, name: "Brake Pads", category: "Brakes", price: 1200, stock: 20,
      suppliers: [
        { name: "XYZ Auto", contact: "9988776655" },
        { name: "CarZone", contact: "7788996655" }
      ]
    },
    { 
      id: 4, name: "Battery", category: "Electrical", price: 4500, stock: 10,
      suppliers: [
        { name: "PowerMax", contact: "9090909090" }
      ]
    },
  ];

  // States
  const [activeTab, setActiveTab] = useState(categories[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPart, setSelectedPart] = useState(null);

  // Filter parts based on active category + search
  const filteredParts = spareParts.filter(
    (part) =>
      part.category === activeTab &&
      part.name.toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* Category Tabs */}
      <ul className="nav nav-tabs justify-content-center mb-4">
        {categories.map((cat) => (
          <li key={cat} className="nav-item">
            <button
              className={`nav-link ${activeTab === cat ? "active fw-bold" : ""}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>

      {/* Spare Parts Grid */}
      <div className="row g-4">
        {filteredParts.length > 0 ? (
          filteredParts.map((part) => (
            <div key={part.id} className="col-md-3">
              <div className="card h-100 shadow-sm border-0 rounded-3">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-semibold">{part.name}</h5>
                  <p className="card-text mb-3">
                    <span className="d-block">
                      <strong>Category:</strong> {part.category}
                    </span>
                    <span className="d-block">
                      <strong>Price:</strong> ₹{part.price}
                    </span>
                    <span className="d-block">
                      <strong>Stock:</strong> {part.stock} pcs
                    </span>
                  </p>
                  <button
                    className="btn btn-primary mt-auto w-100 rounded-pill"
                    data-bs-toggle="modal"
                    data-bs-target="#detailsModal"
                    onClick={() => setSelectedPart(part)}   // ✅ Fixed
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

      {/* Bootstrap Modal for Details */}
      <div
        className="modal fade"
        id="detailsModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">
                {selectedPart ? selectedPart.name : "Spare Part Details"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedPart ? (
                <>
                  <p><strong>Category:</strong> {selectedPart.category}</p>
                  <p><strong>Price:</strong> ₹{selectedPart.price}</p>
                  <p><strong>Stock:</strong> {selectedPart.stock} pcs</p>

                  <h6 className="mt-4 fw-bold">Suppliers</h6>
                  <ul className="list-group">
                    {selectedPart.suppliers.map((sup, idx) => (
                      <li key={idx} className="list-group-item">
                        <strong>{sup.name}</strong> <br />
                        📞 {sup.contact}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-muted">No details available</p>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary rounded-pill"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-success rounded-pill">
                Request Quotation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpareParts;
