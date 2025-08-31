import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Simple validation
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        setError('');
        // TODO: Add authentication logic here
        try {
            const response = await axiosInstance.post('/api/users/login', { email, password });
            const roleName = response.data.data.roleId.roleName;
            if (roleName !== 'admin') {
                setError(`you don't have admin access`)
            }else{
                navigate('/supplier-requests')
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        }   
    };

    return (
        <div style={{ maxWidth: 400, margin: '50px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        style={{ width: '100%', padding: 8, marginTop: 4 }}
                        required
                    />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: 8, marginTop: 4 }}
                        required
                    />
                </div>
                {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
                <button type="submit" style={{ width: '100%', padding: 10 }}>Login</button>
            </form>
        </div>
    );
};

export default Login