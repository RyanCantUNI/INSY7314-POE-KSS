# Customer International Payments Portal

This project is a secure Customer International Payments Portal built using React for the frontend and Node.js with Express for the backend. The application is designed to handle user authentication and manage payments securely while enforcing best practices in security.

## Features

- **Secure Authentication**: User registration and login with password hashing and salting using bcrypt.
- **Input Validation**: All user inputs are validated against whitelisted regex patterns to prevent injection attacks.
- **SSL/TLS**: All traffic is served over HTTPS to ensure data security in transit.
- **Protection Against Common Attacks**: The application is protected against XSS, CSRF, SQL injection, and other common vulnerabilities.
- **User Dashboard**: A protected route that displays user information after successful login.

## Project Structure

```
customer-payments-portal
├── client                  # Frontend React application
│   ├── public
│   │   └── index.html      # Main HTML file
│   ├── src
│   │   ├── App.jsx         # Main App component
│   │   ├── api.js          # Axios instance for API requests
│   │   ├── index.js        # Entry point for React application
│   │   ├── components       # React components
│   │   │   ├── Login.jsx    # Login component
│   │   │   └── Dashboard.jsx # Dashboard component
│   │   └── styles
│   │       └── App.css     # CSS styles
│   ├── package.json        # Client package configuration
│   └── .env.example        # Example environment variables
├── server                  # Backend Node.js application
│   ├── routes
│   │   └── auth.js         # Authentication routes
│   ├── sql
│   │   └── schema.sql      # Database schema
│   ├── index.js            # Entry point for server application
│   ├── db.js               # Database connection logic
│   ├── package.json        # Server package configuration
│   ├── .env.example        # Example environment variables
│   └── middleware
│       └── security.js     # Security middleware
├── SECURITY_NOTES.md       # Security practices and guidelines
├── DEPLOY.md               # Deployment instructions
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

- Node.js and npm installed
- PostgreSQL database set up

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd customer-payments-portal
   ```

2. Set up the server:
   - Navigate to the `server` directory:
     ```
     cd server
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Create the database schema:
     ```
     psql -U <username> -d <database> -f sql/schema.sql
     ```
   - Set environment variables in a `.env` file based on `.env.example`.

3. Set up the client:
   - Navigate to the `client` directory:
     ```
     cd ../client
     ```
   - Install dependencies:
     ```
     npm install
     ```

### Running the Application

- Start the server:
  ```
  cd server
  npm start
  ```

- Start the client:
  ```
  cd client
  npm start
  ```

Visit `http://localhost:3000` to access the application.

## Security Considerations

Refer to `SECURITY_NOTES.md` for detailed security practices and guidelines to ensure the application remains secure.

## Deployment

For deployment instructions, refer to `DEPLOY.md`.