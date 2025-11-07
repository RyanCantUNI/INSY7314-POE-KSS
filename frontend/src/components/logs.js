import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PaymentList = () => {
    const [payments, setPayments] = useState([]);
    const navigate = useNavigate();
    console.log(Array.isArray(payments));

    //Get blogs
    useEffect(() => {
        //get current user 
        const loginID = localStorage.getItem("userID");
        //get token
        const token = localStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        axios.get("https://localhost:443/payments/" + loginID)
            .then((response) => {
                
                setPayments(response.data);
            })
            .catch((error) => {
                console.error("Error fetching payments:", error);
            });
    }, []);

    
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
            <h1 style={{ marginBottom: '10px', marginTop: '200px', color: '#FFFFFF' }}>Payment List</h1>
            <button onClick={() => navigate("/payment")} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Go Back
            </button>
            <br />
            <ul style={{ listStyle: 'none', padding: '0' }}>
                {payments.map((payment) => (
                    <li key={payment.paymentID} style={{ marginBottom: '20px', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', textAlign: 'left' }}>

                        <h2 style={{ marginBottom: '5px', color: '#666' }}>Payment ID: {payment.id}</h2>
                        <p style={{ marginBottom: '5px', color: '#333' }}>Date: {payment.date}</p>
                        <p style={{ marginBottom: '5px', color: '#666' }}>Amount: {payment.amount}</p>
                        <p style={{ marginBottom: '5px', color: '#666' }}>Provider Account: {payment.account_paid_to}</p>
                        <p style={{ marginBottom: '5px', color: '#666' }}>Account Name: {payment.accountName}</p>
                        
                    </li>
                ))}
            </ul>
        </div>
    );
}


//Export the list of payments

//payment model
    /*
    id

    amount

    account_paid_to(number)

    accountName

    branchCode

    SwiftID(optional)

    date

    customer_id*/

    //Return the list of payments
export default PaymentList
