import React from 'react'
import Login from './components/auth/Login'
import 'react-toastify/dist/ReactToastify.css';
import AOS from "aos";
import { useEffect } from 'react';
import "aos/dist/aos.css";
const App = () => {
  // Init AOS
    useEffect(() => {
      AOS.init({ duration: 800, once: true });
    }, []);
  return (
    <div>
       
      <Login/>
    </div>
  )
}

export default App