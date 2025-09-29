import React from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  return (
    <div className="app-root">
      <h1>Customer Payments Portal</h1>
      <Login />
      <Dashboard />
    </div>
  );
}