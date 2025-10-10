import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Payment from './components/payment';
import Logs from './components/logs';

// Move Index outside App
function Index() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Our App</h1>
        <p>Please log in or register to continue.</p>
        <div className="button-container">
          <button className="btn btn-register btn-primary" onClick={() => window.location.href = '/register'}>Register</button>
          <button className="btn btn-login btn-secondary" onClick={() => window.location.href = '/login'}>Login</button>
        </div>
      </header>
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