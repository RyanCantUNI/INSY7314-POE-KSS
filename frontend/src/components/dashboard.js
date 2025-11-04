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
        }}>
            <h1>Customers</h1>

        </div>
    );
}