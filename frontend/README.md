# Project Title
KracKShacKSecurity

# Description
KracKShacKSecurity presents a secure international payment system designed for banking institutions to manage customer and employee interactions safely. The platform allows customers to register, log in, and make international payments via a web portal, while bank employees verify and forward transactions to SWIFT. Built with React and Node.js, the system emphasizes strong cybersecurity practices, including password hashing and salting, SSL encryption, input whitelisting using RegEx, and protection against common web vulnerabilities such as XSS, CSRF, and SQL injection.

# Features
- Secure user registration and login (with bcrypt hashing)
- International payment submission and verification
- Employee portal for transaction validation and SWIFT forwarding
- RegEx-based input whitelisting for data sanitization
- HTTPS/SSL implementation for secure traffic
- Protection against OWASP Top 10 vulnerabilities (XSS, CSRF, SQL Injection)
- RESTful API for backend communication

# Tech Stack
**Frontend:** React, Vite, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Mongoose)  
**Security:** Bcrypt, Helmet, RegEx validation, SSL  
**Tools:** Visual Studio Code, Git, npm  

# Installation Instructions
- Pull from Git Repository
- Open two terminals, one for the backend, and one for the frontend

# Usage Instructions
- In the terminal for frontend, input npm run dev to run the frontend
- For backend, input npm start to connect the project to the server
- Access the app in your browser at: http://localhost:5173
- or the backend API at: http://localhost:5000/api