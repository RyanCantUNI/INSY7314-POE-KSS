import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    try {
      const response = await axios.post('https://localhost:44300/api/register', formData);
      alert('User registered successfully!');
      console.log('Registration response:', response.data);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);

      if (error.response) {
        alert(`Registration failed: ${error.response.data.message || error.response.data}`);
      } else if (error.request) {
        alert('Cannot connect to server. Please ensure the backend is running.');
      } else {
        alert('Registration failed. Please check your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 4px 25px rgba(0, 0, 0, 0.15)',
          width: '100%',
          maxWidth: '450px',
          textAlign: 'center'
        }}
      >
        <h1 style={{ marginBottom: '10px', color: '#333', fontWeight: '700' }}>Create Account</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>Fill in your details to register.</p>

        <form onSubmit={handleSubmit}>
          {['fullName', 'email', 'idNumber', 'accountNumber', 'password'].map((field) => (
            <div key={field} style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: '600',
                  color: '#333'
                }}
              >
                {field === 'fullName'
                  ? 'Full Name'
                  : field === 'email'
                  ? 'Email'
                  : field === 'idNumber'
                  ? 'ID Number'
                  : field === 'accountNumber'
                  ? 'Account Number'
                  : 'Password'}
              </label>
              <input
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                name={field}
                placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                value={formData[field]}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2575fc')}
                onBlur={(e) => (e.target.style.borderColor = '#ccc')}
              />
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#2575fc',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                width: '48%',
                opacity: loading ? 0.7 : 1,
                transition: 'background-color 0.3s ease, transform 0.2s ease'
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#1a5fd1')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#2575fc')}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: '#f0f0f0',
                color: '#333',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                width: '48%',
                transition: 'background-color 0.3s ease, transform 0.2s ease'
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#e0e0e0')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
