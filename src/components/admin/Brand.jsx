import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance.js";
import { BASE_URL } from "../../utils/axiosInstance.js";
const Brand = () => {
  const [brands, setBrands] = useState([
    
  ]);

  const [form, setForm] = useState({ name: "", logo: null });
  const [editingId, setEditingId] = useState(null);

  const createBrand =async (form)=>{
    try{
      const response = await axiosInstance.post('/api/car-brand/create-brand',form,{
        headers:{"Content-Type": "multipart/form-data"}
      })
        // return response.data.data;
        setBrands([...brands, response.data.data]);
    }catch(error){
       if (error.response?.status === 400) {
        alert(error.response.data.message); // Show error message from backend
      } else {
        console.error("Error creating category:", error);
        alert("Something went wrong. Please try again.");
      }
      return null
    }
  }
  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, logo: file });
    }
  };

  // Add / Update Brand
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingId) {
      // Update brand
      setBrands(
        brands.map((b) =>
          b._id === editingId ? { ...b, name: form.name, logo: form.logo } : b
        )
      );
      setEditingId(null);
    } else {
      // Add new brand
      const newBrand = await createBrand(form);
      if(newBrand){
        setBrands([...brands, { _id: Date.now(), ...form }]);
      }

    }

    setForm({ name: "", logo: null });
  };

  // Delete Brand
  const handleDelete = async(_id) => {
    const res=await axiosInstance.delete(`/api/car-brand/delete-brand/${_id}`);
    if(!res) return;
    setBrands(brands.filter((b) => b._id !== _id));
  };

  // Edit Brand
  const handleEdit = (brand) => {
    setForm({ name: brand.name, logo: brand.logo });
    setEditingId(brand._id);
  };

  // Fetch Brands (Simulated with static data here)
  const fetchBrands = async() => {
    try {
      const res=await axiosInstance.get('/api/car-brand/get-brand');
      if(!res) return;
      console.log("brands are",res.data.data);
      setBrands(res.data.data);  

      
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchBrands();
    return ()=>{
      setBrands([]);
    }
  }, []);
  return (
    <div className="container mt-4">
      {/* Add/Update Brand Form */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-header fw-bold">
          {editingId ? "Update Brand" : "Add Brand"}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Brand Name"
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
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                {editingId ? "Update" : "Add"}
              </button>
            </div>
            {editingId && (
              <div className="col-md-2">
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={() => {
                    setForm({ name: "", logo: null });
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

      {/* Brand Table */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-header fw-bold">Brand List</div>
        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Brand</th>
                <th>Logo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b._id}>
                  <td>{b._id}</td>
                  <td>{b.name}</td>
                  <td>
                    {b.logo ? (
                      <img
                        src={BASE_URL+"/"+b.logo}
                        alt={b.name}
                        style={{
                          width: "60px",
                          height: "40px",
                          objectFit: "contain",
                        }}
                        className="rounded shadow-sm"
                      />
                    ) : (
                      <span className="text-muted">No Logo</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(b)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(b._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {brands.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No brands added yet
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

export default Brand;
