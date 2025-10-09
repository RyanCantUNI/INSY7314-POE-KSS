import { useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { useNavigate } from "react-router-dom";

const PaymentList = () => {
    const [payments, setPayments] = useState([]);
    const navigate = useNavigate();
    Array.isArray(payments);

    //Get blogs
    useEffect(() => {
        axios.get("https://localhost:443/api/logs")
            .then((response) => {
                setPayments(response.data);
            })
            .catch((error) => {
                console.error("Error fetching payments:", error);
            });
    }, []);

    //Return the list of payments
    return (
        <div>
            <h1>Payment List</h1>
            <ul>
                {payments.map((payment) => (
                    <li key={payment.paymentID}>
                        <h2>{payment.paymentID}</h2>
                        <p>Date: {payment.date}</p>
                        <p>User ID: {payment.userID}</p>
                        <p>Amount: {payment.amount}</p>
                        <p>Provider Account: {payment.providerAccount}</p>
                        <p>Currency: {payment.currency}</p>
                        <p>SWIFT Code: {payment.SWIFTCode}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
//Export the list of payments
export default PaymentList
