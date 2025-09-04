import React, { useState } from "react";

const Model = () => {
  const [models, setModels] = useState([
    { _id: 1, name: "Corolla", brandId: 1, image: "d" },
    { _id: 2, name: "Mustang", brandId: 2, image: "d" },
  ]);

  const [brands, setBrands] = useState([
    { _id: 1, name: "Toyota" },
    { _id: 2, name: "Ford" },
    { _id: 3, name: "BMW" },
  ]);

  const [form, setForm] = useState({ name: "", brandId: "", image: null });
  const [editingId, setEditingId] = useState(null);

  // Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: URL.createObjectURL(file) });
    }
  };

  // Add or Update Model
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.brandId) return;

    if (editingId) {
      setModels(
        models.map((m) =>
          m._id === editingId ? { ...m, ...form } : m
        )
      );
      setEditingId(null);
    } else {
      setModels([...models, { _id: Date.now(), ...form }]);
    }

    setForm({ name: "", brandId: "", image: null });
  };

  // Edit Model
  const handleEdit = (model) => {
    setForm({ name: model.name, brandId: model.brandId, image: model.image });
    setEditingId(model._id);
  };

  // Delete Model
  const handleDelete = (_id) => {
    setModels(models.filter((m) => m._id !== _id));
  };

  return (
    <div className="container mt-4">
      {/* Add/Update Model Form */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-header fw-bold">
          {editingId ? "Update Model" : "Add Model"}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-4">
              <select
                className="form-select"
                value={form.brandId}
                onChange={(e) =>
                  setForm({ ...form, brandId: Number(e.target.value) })
                }
              >
                <option value="">Select Brand</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Model Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="col-md-6">
              <button type="submit" className="btn btn-primary w-100">
                {editingId ? "Update" : "Add"}
              </button>
            </div>
            {editingId && (
              <div className="col-md-6">
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={() => {
                    setForm({ name: "", brandId: "", image: null });
                    setEditingId(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Models Table */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-header fw-bold">Model List</div>
        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Model</th>
                <th>Brand</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m) => (
                <tr key={m._id}>
                  <td>{m._id}</td>
                  <td>{m.name}</td>
                  <td>{brands.find((b) => b._id === m.brandId)?.name}</td>
                  <td>
                    {m.image ? (
                      <img
                        src={'https://imgd.aeplcdn.com/642x336/n/cw/ec/124027/hyryder-exterior-right-front-three-quarter-73.jpeg?isig=0&q=80'}
                        alt={m.name}
                        style={{ width: "100px", height: "50px", objectFit: "contain" }}
                        className="rounded shadow-sm"
                      />
                    ) : (
                      <span className="text-muted">No Image</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(m)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(m._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {models.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No models added yet
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

export default Model;
