import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Payment from './components/payment';
import Logs from './components/logs';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to Our App</h1>
          <p>Please log in or register to continue.</p>
          <div className="button-container">
            <a href="/login" className="btn btn-login">Login</a>
            <a href="/register" className="btn btn-register">Register</a>
          </div>
        </header>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/logs" element={<Logs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;