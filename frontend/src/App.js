import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Payment from './components/payment';
import Logs from './components/logs';

//  Updated Landing (Index) Page
function Index() {
  const navigate = useNavigate();

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
        <h1 style={{ color: '#333', marginBottom: '10px', fontWeight: '700' }}>Welcome to Our App</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Please log in or register to continue.
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              backgroundColor: '#2575fc',
              color: '#fff',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              width: '48%',
              transition: 'background-color 0.3s ease, transform 0.2s ease'
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#1a5fd1')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#2575fc')}
            onFocus={e => (e.target.style.backgroundColor = '#1a5fd1')} 
            onBlur={e => (e.target.style.backgroundColor = '#2575fc')}  
          >
            Register
          </button>

          <button
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: '#f0f0f0',
              color: '#333',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              width: '48%',
              transition: 'background-color 0.3s ease, transform 0.2s ease'
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#e0e0e0')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
            onFocus={e => (e.target.style.backgroundColor = '#e0e0e0')}
            onBlur={e => (e.target.style.backgroundColor = '#f0f0f0')}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/logs" element={<Logs />} />
      </Routes>
    </Router>
  );
}

export default App;
