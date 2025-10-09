import React from 'react';
import './App.css';
import logo from './logo.svg';

function App() {
  const handleLogin = () => {
    alert('Redirecting to Login...');
    // Later: navigate to /login page or open login modal
  };

  const handleRegister = () => {
    alert('Redirecting to Register...');
    // Later: navigate to /register page or open register modal
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <h1>Welcome to Our App</h1>
        <p>Please log in or register to continue.</p>

        <div className="button-container">
          <button className="btn btn-login" onClick={handleLogin}>Login</button>
          <button className="btn btn-register" onClick={handleRegister}>Register</button>
        </div>
      </header>
    </div>
  );
}

export default App;
