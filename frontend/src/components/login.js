import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
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
      // Send POST request to backend
      const response = await axios.post('https://localhost:443/login', formData, {
        withCredentials: true, // allows cookies if backend sets them
      });

      // Get JWT token from backend
      const token = response.data.token;

      // Store it in localStorage for persistence
      localStorage.setItem('token', token);

      alert('Successfully logged in!');
      navigate('/payments'); // redirect to next page
    } catch (error) {
      console.error('Login error:', error);

      if (error.response) {
        alert(`Login failed: ${error.response.data.message || error.response.data}`);
      } else if (error.request) {
        alert('Cannot connect to server. Please ensure the backend is running on https://localhost:443');
      } else {
        alert('Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
      <h1>Login Page</h1>
      <p>Welcome back! Please log in below.</p>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
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
            Login
          </button>
          <button type="button" onClick={() => navigate('/register')} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
