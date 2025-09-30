import React, { useEffect } from 'react';
import Login from './components/auth/Login';
import 'react-toastify/dist/ReactToastify.css';
import AOS from "aos";
import "aos/dist/aos.css";
import {jwtDecode} from 'jwt-decode';  // ✅ default import

const App = () => {
  const token = localStorage.getItem("token"); 

  let decode = null;
  if (token) {
    try {
      decode = jwtDecode(token);
      console.log("Decoded Token:", decode);

      if (decode.roleId?.roleName === "admin") {
        window.location.href = "/admin";
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }

  // Init AOS
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div>
      <Login />
    </div>
  );
}

export default App;
