import { useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { useNavigate } from "react-router-dom";

const PaymentList = () => {
    const [payments, setPayments] = useState([]);
    const navigate = useNavigate();
    Array.isArray(payments);

    //Get blogs
    useEffect(() => {
        axios.get("https://localhost:443/logs")
            .then((response) => {
                setPayments(response.data);
            })
            .catch((error) => {
                console.error("Error fetching payments:", error);
            });
    }, []);

    //Return the list of payments
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
            width: '100%',
            maxWidth: '600px',
            textAlign: 'center'
        }}>
            <h1 style={{ marginBottom: '10px', color: '#333' }}>Payment List</h1>
            <ul style={{ listStyle: 'none', padding: '0' }}>
                {payments.map((payment) => (
                    <li key={payment.paymentID} style={{ marginBottom: '20px', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', textAlign: 'left' }}>
                        <h2 style={{ marginBottom: '5px', color: '#333' }}>{payment.paymentID}</h2>
                        <p style={{ marginBottom: '5px', color: '#666' }}>Date: {payment.date}</p>
                        <p style={{ marginBottom: '5px', color: '#666' }}>User ID: {payment.userID}</p>
                        <p style={{ marginBottom: '5px', color: '#666' }}>Amount: {payment.amount}</p>
                        <p style={{ marginBottom: '5px', color: '#666' }}>Provider Account: {payment.providerAccount}</p>
                        <p style={{ marginBottom: '5px', color: '#666' }}>Currency: {payment.currency}</p>
                        <p style={{ marginBottom: '5px', color: '#666' }}>SWIFT Code: {payment.SWIFTCode}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
//Export the list of payments
export default PaymentList
