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

    const user = {
      email: formData.email,
      password: formData.password,
    };

    axios.post("https://localhost:443/login", user)
      .then((response) => {
        alert("Login successful!");
        // Store UUID directly without intermediate variable
        localStorage.setItem("userID", response.data.UUID);

        //Redirect to dashboard if admin
        if (response.data.role === 'admin') {
          navigate("/dashboard");
        }
        else if (response.data.role === 'customer') {
          // Store userID and redirect
          localStorage.setItem("userID", response.data.UUID);
          console.log(response.data.UUID);
          navigate("/payment");
        } else {
          alert("Role error. Please contact admin.");
        }
      })
      .catch((error) => {
        alert("Login failed. Please check your credentials.");
        if (process.env.NODE_ENV === 'development') {
          console.error("Login error:", error);
        }
      });
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h1 style={{ marginBottom: '10px', color: '#333' }}>Login</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>Welcome back! Please log in below.</p>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '30px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#2575fc',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                width: '48%',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1a5fd1'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#2575fc'}
              onFocus={e => (e.target.style.backgroundColor = '#1a5fd1')}
              onBlur={e => (e.target.style.backgroundColor = '#2575fc')}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
