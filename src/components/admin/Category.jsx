import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance.js";


const Category = () => {
  const [categories, setCategories] = useState([
  ]);

  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const createCategory = async (name) => {
    try {
      const response = await axiosInstance.post('/api/category/create-category', { name });
      console.log(response);
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.message); // Show error message from backend
      } else {
        console.error("Error creating category:", error);
        alert("Something went wrong. Please try again.");
      }
      return null
    }
  }

  const updateCategory = async (_id, name) => {
    try {
      const response = await axiosInstance.put(`/api/category/update-category/${_id}`, { name });
      alert(response.data.message);
      return response.data.data;
    } catch (error) {
      if (error.response?.status == 400) {
        alert(error.response.data.message);
      } else {
        console.error("Error creating category:", error);
        alert("Something went wrong. Please try again.");
      }
      return null;
    }

  }

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/api/category/get-category');
      setCategories(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  const deleteCategory = async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/category/delete-category/${id}`);
      alert(response.data.message);
      return true;
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete category");
      return false;
    }
  }
  useEffect(() => {
    fetchCategories();
  }, [])

  // Add or Update Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editId) {
      // Update existing
      const updatedCategory = await updateCategory(editId, name);
      if (updateCategory) {
        setCategories(
          categories.map((cat) =>
            cat._id === editId ? { ...cat, name } : cat
          )
        );
      }

      setEditId(null);
    } else {
      // Add new
      const newCategory = await createCategory(name);
      if (newCategory) {
        setCategories([...categories, newCategory]);
      }
    }

    setName("");
  };

  // Delete category
  const handleDelete = async (_id) => {
    const isDeleted = await deleteCategory(_id);
    if (isDeleted) {
      setCategories(categories.filter((cat) => cat._id !== _id));
      if (editId === _id) {
        setEditId(null);
        setName("");
      }
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
