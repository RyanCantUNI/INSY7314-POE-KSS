import { useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { useNavigate } from "react-router-dom";



const AddPayment = () => {
    const userID = localStorage.getItem("userID");
    const [amount, setAmount] = useState('');
    const [providerAccount, setProviderAccount] = useState('');
    const [currency, setCurrency] = useState('');
    const [SWIFTCode, setSWIFTCode] = useState('');
    const navigate = useNavigate();

    const handleAddPayment = (e) => {
        e.preventDefault();
        const payment = {
           
            amount: amount,
            providerAccount: providerAccount,
            currency: currency,
            SWIFTCode: SWIFTCode
        };
        const token = localStorage.getItem("token"); 

        const loginID = localStorage.getItem("userID"); 
        
        
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        axios.post("https://localhost:443/payment:"+loginID, payment)
            .then((response) => {
                alert("Payment added successfully!");
                //console.log(response.data); //--used for debugging
                navigate("/logs");
            })
            .catch((error) => {
                alert("Error adding payment. Please try again.");
                console.error("Error adding payment:", error);
            });
    };
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
            fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
        }}>
            <div style={{
                backgroundColor: '#fff',
                padding: '40px',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center'
            }}>
                <h1 style={{ marginBottom: '10px', color: '#333' }}>Add Payment</h1>
                <p style={{ color: '#666', marginBottom: '30px' }}>Welcome back! Please add a payment below.</p>

                <form onSubmit={handleAddPayment}>
                    {/* Amount Field */}
                    <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>Amount</label>
                        <input
                            type="number"
                            name="amount"
                            placeholder="Enter the amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #ccc',
                                boxSizing: 'border-box'
                            }}
                            required
                        />
                    </div>

                    {/* Provider Account Field */}
                    <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>Provider Account</label>
                        <input
                            type="text"
                            name="providerAccount"
                            placeholder="Enter the provider account"
                            value={providerAccount}
                            onChange={(e) => setProviderAccount(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #ccc',
                                boxSizing: 'border-box'
                            }}
                            required
                        />
                    </div>

                    {/* Currency Field */}
                    <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>Currency</label>
                        <input
                            type="text"
                            name="currency"
                            placeholder="Enter the currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #ccc',
                                boxSizing: 'border-box'
                            }}
                            required
                        />
                    </div>

                    {/* SWIFT Code Field */}
                    <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>SWIFT Code</label>
                        <input
                            type="text"
                            name="SWIFTCode"
                            placeholder="Enter the SWIFT code"
                            value={SWIFTCode}
                            onChange={(e) => setSWIFTCode(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #ccc',
                                boxSizing: 'border-box'
                            }}
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#2575fc',
                                color: '#fff',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                width: '48%',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#1a5fd1'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#2575fc'}
                        >
                            Add Payment
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/logs')}
                            style={{
                                backgroundColor: '#909090',
                                color: '#fff',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                width: '48%',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#a0a0a0'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#909090'}
                        >
                            See Logs
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
//Export the add payment component
export default AddPayment