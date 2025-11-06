import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [admins, setAdmins] = useState([]);
    Array.isArray(customers);

    //Get users
    useEffect(() => {
        //get current user 
        const loginID = localStorage.getItem("userID");

        //get token
        const token = localStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        axios.get("https://localhost:443/getuser")
            .then((response) => {
                setCustomers(response.data.customers);
                setAdmins(response.data.admins);
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
            <h2>Customers</h2>
            <br />
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Bank Account</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Account Number</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{customer.national_Id}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{customer.account}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{customer.bankaccountnumber}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{customer.name}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{customer.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <h2>Admins</h2>
            <br />
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map((admin) => (
                        <tr key={admin.id}>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{admin.id}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{admin.admin_name}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{admin.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default Dashboard