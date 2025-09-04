import axios from "axios";

const API_URL = "http://localhost:5000/api/categories"; // adjust

// Get all categories
export const getCategories = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Add category
export const addCategory = async (category) => {
  const res = await axios.post(API_URL, category);
  return res.data;
};

// Delete category
export const deleteCategory = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
};
