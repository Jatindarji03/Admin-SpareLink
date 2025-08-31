import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Login from './components/auth/Login.jsx'
import SupplierRequest from './components/SupplierRequest.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

import AdminLayout from './components/AdminLayout/AdminLayout.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="*" element={<h1>404 Not Found</h1>}/>
      <Route path="/supplier-requests" element={<SupplierRequest/>}/>
      <Route path="/supplier" element={<AdminLayout/>}>
        <Route path="dashboard" element={<SupplierRequest/>}/>
      </Route>
    </Routes>
  
  </BrowserRouter>,
)
