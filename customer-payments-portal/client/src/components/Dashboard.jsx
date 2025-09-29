import React, { useEffect, useState } from 'react';
import client from '../api';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await client.get('/api/auth/me');
        setUser(response.data.user);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    return <div role="alert">{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h2>Welcome, {user.username}!</h2>
      <p>Your email: {user.email}</p>
      {/* Additional user information and functionality can be added here */}
    </div>
  );
}