import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        idNumber: '',
        accountNumber: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:443/register', formData);
            alert('User registered successfully!');
            console.log('Registration response:', response.data);
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            if (error.response) {
                // Server responded with error
                alert(`Registration failed: ${error.response.data.message || error.response.data}`);
            } else if (error.request) {
                // Request made but no response
                alert('Cannot connect to server. Please ensure the backend is running on https://localhost:443');
            } else {
                // Other errors
                alert('Registration failed. Please check your details.');
            }
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
            <h1>Register Page</h1>
            <p>Create a new account below.</p>
            <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', textAlign: 'left' }}>Full Name:</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', textAlign: 'left' }}>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', textAlign: 'left' }}>ID Number:</label>
                    <input
                        type="text"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', textAlign: 'left' }}>Account Number:</label>
                    <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', textAlign: 'left' }}>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <div style={{ marginTop: '20px' }}>
                    <button type="submit" style={{ padding: '10px 20px', marginRight: '10px', cursor: 'pointer' }}>
                        Register
                    </button>
                    <button type="button" onClick={() => navigate('/login')} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                        Back to Login
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Register;
