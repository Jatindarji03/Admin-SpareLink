import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import axiosInstance from '../../utils/axiosInstance';



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const token=localStorage.getItem("token");
    useEffect(()=>{

        if(token){
            navigate("/admin");
        }
    },[]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Simple validation with toast
        if (!email || !password) {
            toast.error('Please enter both email and password.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await axiosInstance.post('/api/users/login', { email, password });
            const roleName = response.data.data.roleId.roleName;
            
            if (roleName !== 'admin') {
                toast.error("You don't have admin access", {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                // Store authentication data
                localStorage.setItem('token', response.data.authtoken);
                localStorage.setItem('user', JSON.stringify(response.data.data._id));
                localStorage.setItem('role', JSON.stringify(response.data.data.roleId.roleName));
                
                // Success toast
                toast.success('Login successful! Redirecting...', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                
                // Delay navigation for better UX
                setTimeout(() => {
                    navigate('/admin');
                }, 1500);
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Login failed. Please try again.', {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <motion.div 
                className="login-container"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <motion.div 
                    className="login-card"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <motion.div 
                        className="login-header"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="logo-container">
                            <div className="logo">
                                <span className="logo-text">SL</span>
                            </div>
                        </div>
                        <h2 className="login-title">Admin Login</h2>
                        <p className="login-subtitle">Access your Sparelink admin panel</p>
                    </motion.div>

                    <motion.form 
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <motion.div 
                            className="form-group"
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        >
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <motion.input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="Enter your email"
                                required
                                whileFocus={{ borderColor: "#2563eb" }}
                                transition={{ duration: 0.2 }}
                            />
                        </motion.div>

                        <motion.div 
                            className="form-group"
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        >
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <motion.input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="Enter your password"
                                required
                                whileFocus={{ borderColor: "#2563eb" }}
                                transition={{ duration: 0.2 }}
                            />
                        </motion.div>

                        <motion.button
                            type="submit"
                            className="login-button"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isLoading ? (
                                <div className="loading-container">
                                    <ClipLoader color="#ffffff" size={20} />
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </motion.button>
                    </motion.form>

                    <motion.div 
                        className="login-footer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        <p className="footer-text">
                            Secure admin access for Sparelink platform
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>
            
           
        </>
    );
};

export default Login;
