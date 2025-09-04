import React, { useState } from "react";

const Variant = () => {
  // Example models (you can fetch from API later)
  const models = ["Toyota Corolla", "Ford Mustang", "Honda Civic", "BMW 3 Series"];

  const [variants, setVariants] = useState([
    { _id: 1, name: "Corolla XLE", model: "Toyota Corolla" },
    { _id: 2, name: "Mustang GT", model: "Ford Mustang" },
  ]);

  const [form, setForm] = useState({ name: "", model: "" });
  const [editId, setEditId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.model.trim()) return;

    if (editId) {
      // Update existing variant
      setVariants(
        variants.map((v) =>
          v._id === editId ? { ...v, name: form.name, model: form.model } : v
        )
      );
      setEditId(null);
    } else {
      // Add new variant
      setVariants([...variants, { _id: Date.now(), name: form.name, model: form.model }]);
    }

    setForm({ name: "", model: "" });
  };

  const handleEdit = (variant) => {
    setForm({ name: variant.name, model: variant.model });
    setEditId(variant._id);
  };

  const handleDelete = (_id) => {
    setVariants(variants.filter((v) => v._id !== _id));
    if (editId === _id) {
      setForm({ name: "", model: "" });
      setEditId(null);
    }
  };

  return (
    <div className="container mt-4">
      {/* Add / Edit Variant Form */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-header fw-bold">
          {editId ? "Edit Variant" : "Add Variant"}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            {/* Variant Name */}
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Variant Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Model Dropdown */}
            <div className="col-md-4">
              <select
                className="form-select"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
              >
                <option value="">Select Model</option>
                {models.map((m, i) => (
                  <option key={i} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                {editId ? "Update" : "Add"}
              </button>
            </div>

            {/* Cancel Edit */}
            {editId && (
              <div className="col-md-2">
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={() => {
                    setEditId(null);
                    setForm({ name: "", model: "" });
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Variant List Table */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-header fw-bold">Variant List</div>
        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th style={{ width: "100px" }}>_id</th>
                <th>Variant Name</th>
                <th>Model</th>
                <th style={{ width: "200px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => (
                <tr key={v._id}>
                  <td>{v._id}</td>
                  <td>{v.name}</td>
                  <td>{v.model}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(v)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(v._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {variants.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No variants added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Variant;
