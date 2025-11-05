import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    Array.isArray(customers);

    //Get users
    useEffect(() => {
        //get current user 
        const loginID = localStorage.getItem("userID");

        //get token
        const token = localStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        axios.get("https://localhost:443/dashboard:" + loginID)
            .then((response) => {
                setCustomers(response.data);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    }, [])

    //Return the list of users
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#f5f5f5',
            padding: '40px',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
            width: '100%',
            boxSizing: 'border-box',
            margin: '0 0 0 0',
            overflow: 'auto',
            fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
            textAlign: 'center'
        }}>
            <h1 style={{ marginBottom: '10px', marginTop: '200px', color: '#FFFFFF' }}>Customers</h1>
            <button onClick={() => navigate("/login")} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Logout
            </button>
            <br />
            <ul style={{ listStyle: 'none', padding: '0' }}>
                {customers.map((customer) => (
                    <li key={customer.id} style={{ marginBottom: '10px', color: '#FFFFFF' }}>
                        {customer.fullName}
                    </li>
                ))}
            </ul>
        </div>
    );
}