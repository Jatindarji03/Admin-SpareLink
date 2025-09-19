import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/auth/Login.jsx'
import SupplierRequest from './components/SupplierRequest.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux'
import store from './Store/Store.js'
import { ToastContainer } from 'react-toastify'
import AdminLayout from './components/AdminLayout/AdminLayout.jsx'
import Category from './components/admin/Category.jsx'
import Brand from './components/admin/Brand.jsx'
import Model from './components/admin/Model.jsx'
import Variant from './components/admin/Varient.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import SpareParts from './components/spareparts/SpareParts.jsx'
import Dashboard from './components/admin/Dashboard.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <BrowserRouter>
  <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // you can use "light", "dark", or "colored"
      />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
      <Route path="/supplier-requests" element={<SupplierRequest />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard/>} />
        <Route path="category" element={<Category />} />
        <Route path="brand" element={<Brand />} />
        <Route path="model" element={<Model/>} />
        <Route path="variant" element={<Variant/>} />
        <Route path='spareparts' element={<SpareParts/>} />
        <Route path='quotation' element={<SupplierRequest/>} />
      </Route>

    </Routes>

  </BrowserRouter>
  </Provider>
)
