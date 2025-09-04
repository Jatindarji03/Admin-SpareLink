import React, { useState } from "react";

const Category = () => {
  // Dummy categories
  const [categories, setCategories] = useState([
    { _id: 1, name: "Engine Parts" },
    { _id: 2, name: "Brakes" },
    { _id: 3, name: "Suspension" },
    { _id: 4, name: "Electrical" },
    { _id: 5, name: "Tires" },
    { _id: 6, name: "Accessories" },
  ]);

  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  // Add or Update Category
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editId) {
      // Update existing
      setCategories(
        categories.map((cat) =>
          cat._id === editId ? { ...cat, name } : cat
        )
      );
      setEditId(null);
    } else {
      // Add new
      const newCategory = { _id: Date.now(), name };
      setCategories([...categories, newCategory]);
    }

    setName("");
  };

  // Delete category
  const handleDelete = (_id) => {
    setCategories(categories.filter((cat) => cat._id !== _id));
    if (editId === _id) {
      setEditId(null);
      setName("");
    }
  };

  // Edit category
  const handleEdit = (cat) => {
    setName(cat.name);
    setEditId(cat._id);
  };

  return (
    <div className="container mt-3">
      {/* Card Wrapper */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="p-2 border-bottom">
          <h4 className="mb-0">Manage Categories</h4>
        </div>

        <div className="card-body p-4">
          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3 align-items-center">
              {/* Category Input */}
              <div className="col-md-8">
                <input
                  type="text"
                  id="categoryName"
                  className="form-control form-control-lg shadow-sm"
                  placeholder="Enter category name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="col-md-4 d-flex align-items-end gap-2 ">
                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold shadow-sm"
                >
                  {editId ? "Update" : "Add"}
                </button>
                {editId && (
                  <button
                    type="button"
                    className="btn btn-secondary w-100 shadow-sm"
                    onClick={() => {
                      setEditId(null);
                      setName("");
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Table */}
          <h5 className="mb-3 fw-bold">Category List</h5>
          {categories.length === 0 ? (
            <p className="text-muted">No categories added yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: "100px" }}>ID</th>
                    <th>Category Name</th>
                    <th style={{ width: "200px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat._id}>
                      <td>{cat._id}</td>
                      <td>{cat.name}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(cat)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(cat._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
