import { useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { useNavigate } from "react-router-dom";

const AddPayment = () => {
    const [userID, setUserID] = useState('');
    const [amount, setAmount] = useState('');
    const [providerAccount, setProviderAccount] = useState('');
    const [currency, setCurrency] = useState('');
    const [SWIFTCode, setSWIFTCode] = useState('');
    const navigate = useNavigate();

    const handleAddPayment = (e) => {
        e.preventDefault();
        const payment = {
            userID: userID,
            amount: amount,
            providerAccount: providerAccount,
            currency: currency,
            SWIFTCode: SWIFTCode
        };
        axios.post("https://localhost:443/api/logs", payment)
            .then((response) => {
                alert("Payment added successfully!");
                navigate("/paymentList");
            })
            .catch((error) => {
                alert("Error adding payment. Please try again.");
                console.error("Error adding payment:", error);
            });
    };
    return (
        <form onSubmit={handleAddPayment}>
            <div>
                <label>Amount:</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div>
                <label>Provider Account:</label>
                <input type="text" value={providerAccount} onChange={(e) => setProviderAccount(e.target.value)} />
            </div>
            <div>
                <label>Currency:</label>
                <input type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} />
            </div>
            <div>
                <label>SWIFT Code:</label>
                <input type="text" value={SWIFTCode} onChange={(e) => setSWIFTCode(e.target.value)} />
            </div>
            <div>
                <button type="submit">Add Payment</button>
            </div>
        </form>
    )
}
//Export the add payment component
export default AddPayment