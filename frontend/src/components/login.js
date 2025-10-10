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
      password: formData.password
    };
    axios.post("https://localhost:443/login", user)
      .then((response) => {
        alert("Login successful!");
        localStorage.setItem("userID", response.data.userID);
        console.log(localStorage.getItem("userID", response.data.userID))
        navigate("/payment");
      })
      .catch((error) => {
        alert("Login failed. Please check your credentials.");
        console.error("Login error:", error);
      });
  }
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
