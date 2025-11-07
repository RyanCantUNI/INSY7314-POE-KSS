import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogs = () => {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axios
      .get("https://localhost:443/payments")
      .then((response) => setPayments(response.data))
      .catch((error) => {
        console.error("Error fetching all payments for admin:", error);
      });
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        padding: "40px 10px",
        boxSizing: "border-box",
        overflow: "auto"
      }}
    >
      <h1 style={{ color: "#fff", marginTop: "20px", marginBottom: "20px" }}>
        Admin Payment Logs
      </h1>

      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginBottom: "30px",
          padding: "10px 22px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "1rem",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          transition: "background-color 0.2s"
        }}
        onMouseOver={e => (e.target.style.backgroundColor = "#388e3c")}
        onMouseOut={e => (e.target.style.backgroundColor = "#4CAF50")}
        onFocus={e => (e.target.style.backgroundColor = "#388e3c")}
      >
        Back to Dashboard
      </button>

      <div style={{
        backgroundColor: "rgba(255,255,255,0.97)",
        borderRadius: "16px",
        padding: "30px 16px 16px",
        boxShadow: "0 6px 24px rgba(64, 64, 128, 0.14)",
        width: "100%",
        maxWidth: "1100px",
        overflowX: "auto"
      }}>
        {payments.length === 0 ? (
          <p style={{ color: "#888", fontWeight: "500", textAlign: "center" }}>
            No payments found.
          </p>
        ) : (
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "1rem"
          }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={thStyle}>Payment ID</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Provider Account</th>
                <th style={thStyle}>Account Name</th>
                <th style={thStyle}>Branch Code</th>
                <th style={thStyle}>Customer ID</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, i) => (
                <tr
                  key={payment.id || payment.paymentID || i}
                  style={{
                    background: i % 2 === 0 ? "#fafaff" : "#e9eafb",
                    transition: "background 0.2s"
                  }}
                >
                  <td style={tdStyle}>{payment.id || payment.paymentID}</td>
                  <td style={tdStyle}>{payment.date}</td>
                  <td style={tdStyle}>R{payment.amount}</td>
                  <td style={tdStyle}>{payment.account_paid_to}</td>
                  <td style={tdStyle}>{payment.accountName}</td>
                  <td style={tdStyle}>{payment.branchCode}</td>
                  <td style={tdStyle}>{payment.customer_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const thStyle = {
  padding: "12px 10px",
  border: "1px solid #ddd",
  textAlign: "center",
  backgroundColor: "#f5f5f8",
  color: "#444",
  fontWeight: 700
};

const tdStyle = {
  padding: "10px 8px",
  border: "1px solid #e0e0ea",
  textAlign: "center",
  color: "#333"
};

export default AdminLogs;
