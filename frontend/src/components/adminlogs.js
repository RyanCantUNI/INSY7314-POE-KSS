import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogs = () => {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    

    // Set token for all axios requests
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axios
      .get("https://localhost:443/payments")
      .then((response) => {
        setPayments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching all payments for admin:", error);
      });
  }, [navigate]);

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
      <h1 style={{ color: "#FFFFFF", marginTop: "40px", marginBottom: "20px" }}>
        Admin Payment Logs
      </h1>

      <button
        onClick={() => navigate("/admindashboard")}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Back to Dashboard
      </button>

      <ul
        style={{
          listStyle: "none",
          padding: "0",
          width: "100%",
          maxWidth: "900px",
        }}
      >
        {payments.length === 0 ? (
          <p style={{ color: "#fff" }}>No payments found.</p>
        ) : (
          payments.map((payment) => (
            <li
              key={payment.id || payment.paymentID}
              style={{
                marginBottom: "20px",
                backgroundColor: "#fff",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h3 style={{ marginBottom: "10px", color: "#333" }}>
                Payment ID: {payment.id || payment.paymentID}
              </h3>
              <p style={{ marginBottom: "5px", color: "#555" }}>
                <strong>Date:</strong> {payment.date}
              </p>
              <p style={{ marginBottom: "5px", color: "#555" }}>
                <strong>Amount:</strong> R{payment.amount}
              </p>
              <p style={{ marginBottom: "5px", color: "#555" }}>
                <strong>Provider Account:</strong> {payment.account_paid_to}
              </p>
              <p style={{ marginBottom: "5px", color: "#555" }}>
                <strong>Account Name:</strong> {payment.accountName}
              </p>
              <p style={{ marginBottom: "5px", color: "#555" }}>
                <strong>Branch Code:</strong> {payment.branchCode}
              </p>
              {payment.swiftID && (
                <p style={{ marginBottom: "5px", color: "#555" }}>
                  <strong>SWIFT ID:</strong> {payment.swiftID}
                </p>
              )}
              <p style={{ marginBottom: "5px", color: "#555" }}>
                <strong>Customer ID:</strong> {payment.customer_id}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AdminLogs;
