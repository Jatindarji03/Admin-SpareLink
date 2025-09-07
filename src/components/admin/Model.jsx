import React, { useEffect, useState } from "react";
import axiosInstance, { BASE_URL } from "../../utils/axiosInstance.js";

const Model = () => {
  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({ carModel: "", carBrand: "", image: null });
  const [editingId, setEditingId] = useState(null);

  // ✅ Fetch Brands
  const fetchBrands = async () => {
    try {
      const res = await axiosInstance.get("/api/car-brand/get-brand");
      if (res.status === 200 && Array.isArray(res.data.data)) {
        setBrands(res.data.data);
      } else {
        setBrands([]);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
    }
  };

  // ✅ Fetch Models
  const fetchModels = async () => {
    try {
      const res = await axiosInstance.get("/api/car-model/get-car-model");
      if (res.status === 200 && Array.isArray(res.data.data)) {
        setModels(res.data.data);
        console.log("models are", res.data.data);
      } else {
        setModels([]);
      }
    } catch (error) {
      console.error("Error fetching models:", error);
      setModels([]);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchModels();
  }, []);

  // ✅ Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
    }
  };

  // ✅ Add / Update Model
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.carModel.trim() || !form.carBrand) return;

    try {
      const formData = new FormData();
      formData.append("carModel", form.carModel);
      formData.append("carBrand", form.carBrand);
      if (form.image) formData.append("image", form.image);

      // console.log("Submitting form:", { ...form, editingId });
    // console.log(form);
    
      let res;
      if (editingId) {
        // 🔄 Update Model
        res = await axiosInstance.put(
          `/api/car-model/update-car-model/${editingId}`,
          formData,
         
        );
        // console.log(formData);

      } else {
        // ➕ Create Model
        res = await axiosInstance.post(
          "/api/car-model/create-car-model",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        
      }

      if (res.status === 200 || res.status === 201) {
        alert(res.data.message);
        fetchModels(); // Refresh list
        setForm({ carModel: "", carBrand: "", image: null });
        setEditingId(null);
      }
    } catch (error) {
      console.error("Error saving model:", error);
    }
  };

  // ✅ Edit Model
  const handleEdit = (model) => {
    setForm({
      carModel: model.carModel || "",
      carBrand: model.carBrand?._id || model.carBrand || "",
      image: null,
    });
    setEditingId(model._id);
  };

  // ✅ Delete Model
  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this model?")) return;
    try {
      const res = await axiosInstance.delete(
        `/api/car-model/delete-car-model/${_id}`
      );
      if (res.status === 200) {
      
        fetchModels();
      }
    } catch (error) {
      console.error("Error deleting model:", error);
    }
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
                value={form.carBrand}
                onChange={(e) =>
                  setForm({ ...form, carBrand: e.target.value })
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
                value={form.carModel}
                onChange={(e) =>
                  setForm({ ...form, carModel: e.target.value })
                }
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
                    setForm({ carModel: "", carBrand: "", image: null });
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
              {Array.isArray(models) && models.length > 0 ? (
                models.map((m) => (
                  <tr key={m._id}>
                    <td>{m._id}</td>
                    <td>{m.carModel}</td>
                    <td>
                      {brands.find((b) => b._id === m.carBrand)?.name ||
                        m.carBrand?.name ||
                        "Unknown"}
                    </td>
                    <td>
                      {m.carModelImage ? (
                        <img
                          src={BASE_URL+"/"+m.carModelImage}
                          alt={m.carModel}
                          style={{
                            width: "100px",
                            height: "50px",
                            objectFit: "contain",
                          }}
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
                ))
              ) : (
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
