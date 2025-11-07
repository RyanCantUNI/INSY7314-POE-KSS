# KracKShacK Security

A secure international payment system designed for banking institutions to manage customer and employee interactions safely.

##  Table of Contents

- [Description](#description)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Security Features](#security-features)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

##  Description

KracKShacK Security is a comprehensive international payment platform built for banking institutions. The system enables secure customer registration, authentication, and international payment processing through a modern web interface. Bank employees can verify and forward transactions to SWIFT networks, ensuring compliance with international banking standards.

The platform prioritizes cybersecurity best practices and implements enterprise-grade security measures to protect sensitive financial data and transactions.

##  Features

### Core Functionality
- **Secure User Authentication**: Registration and login with bcrypt password hashing and salting
- **International Payments**: Complete payment submission and verification workflow
- **Employee Portal**: Transaction validation and SWIFT network integration
- **Manager Dashboard**: Real-time statistics, logs, and analytics.
- **Payment History**: Comprehensive transaction logging and audit trails

### Security Features
- **Data Sanitization**: RegEx-based input whitelisting and validation
- **HTTPS/SSL Encryption**: End-to-end secure communication
- **OWASP Top 10 Protection**: Comprehensive vulnerability mitigation
- **Password Security**: Bcrypt hashing with salt rounds
- **Input Validation**: Protection against XSS, CSRF, and SQL injection attacks

### Technical Features
- **RESTful API**: Clean backend communication architecture
- **Manager dashboard**: With data summaries and recent activity
- **Responsive Design**: Modern UI with Tailwind CSS
- **Real-time Updates**: Dynamic payment status tracking
- **Cross-platform Compatibility**: Works across different browsers and devices

##  Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0 or higher)
- **npm** (v6.0 or higher)
- **MongoDB** (v4.0 or higher)
- **Git** (for version control)
- **Modern Web Browser** (Chrome, Firefox, Safari, or Edge)

##  Tech Stack

### Frontend
- **React** - User interface library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Helmet, CORS, XSS-Clean**
- **JWT, Bcrypt, Express-Validator**

### Security & Tools
- **Bcrypt** - Password hashing
- **Helmet** - Security middleware
- **JWT** - JSON Web Tokens for authentication
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing

##  Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd insy7314-poe-kss
```

gloal setup
npm i nodemon concurrently

### 2. Backend Setup
```bash
cd backend
npm install
```

**Backend Dependencies:**
```bash
npm install 
### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

**Frontend Dependencies:**
```bash
npm install express middleware axios react-router-dom
```

### 4. Environment Configuration
Create a `.env` file in the backend directory with the following variables:
```env
PORT=443
MONGODB_URI=mongodb://localhost:27017/krackshack
JWT_SECRET=your-secret-key
NODE_ENV=development
```

##  Usage

### Starting the Application

1. **starting the application**
npm run both 

3. **Access the Application**
   - **Frontend**: http://localhost:443
   - **Backend API**: http://localhost:443/api

### Using the Application

1. **Admin Login**
   - Default admin login: email: APDSadmin@gmail.com
                          password: password123
   - Log in to access the payment system
   - Managers can create, edit, and delete users

2. **Making Payments**
   - Access the payment interface
   - Enter recipient and payment details
   - Submit for verification and processing

3. **Viewing Payment History**
   - Access the logs section
   - Review all past transactions
   - Track payment status and details

### Video of application
https://youtu.be/J_VFB_4mN6Q

##  API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - Manager authentication
- `POST /api/auth/logout` - Manager logout

### Payment Endpoints
- `POST /api/payments` - Create new payment
- `GET /api/payments` - Retrieve payment history
- `GET /api/payments/:id` - Get specific payment details
- `PUT /api/payments/:id/verify` - Verify payment (employee only)

### Log Endpoints
- `GET /api/logs` - Retrieve system logs
- `GET /api/logs/payments` - Retrieve payment logs

##  Security Features

### Authentication & Authorization
- JWT-based token authentication
- Role-based access control (customer/employee)
- Session management and timeout

### Data Protection
- Input sanitization using RegEx patterns
- SQL injection prevention
- XSS attack mitigation
- CSRF protection

### Encryption
- HTTPS/SSL for all communications
- Password hashing with bcrypt
- Secure token storage

##  Development

### Browser Configuration for Development
For testing APIs and handling CORS issues during development, use this Chrome command:
```bash
chrome.exe --ignore-certificate-errors --user-data-dir="C:/temp/chrome_dev" --disable-web-security
```

### Development Tools
- **Web Extension**: Custom extension for enhanced debugging
- **Hot Reload**: Automatic frontend updates during development
- **API Testing**: Built-in endpoints for testing functionality

### Code Structure
```
├── backend/
│   ├── Auth/          # Authentication modules
│   ├── DB/            # Database configuration
│   ├── Payments/      # Payment processing
│   └── server.js      # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   └── App.js     # Main application
│   └── public/        # Static assets
└── key/               # Security keys and certificates
```

##  Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill process using port 443
npx kill-port 443
```

**MongoDB Connection Issues**
- Ensure MongoDB is running
- Check connection string in `.env` file
- Verify database permissions

**CORS Errors**
- Use the Chrome development command above
- Check CORS configuration in backend
- Verify API endpoint URLs

**Authentication Issues**
- Clear browser cache and cookies
- Check JWT secret configuration
- Verify user credentials

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write comprehensive tests for new features
- Update documentation for any API changes
- Ensure all security measures are maintained

##  License

This project is licensed under the MIT License - see the LICENSE file for details.

##  Acknowledgements

This project was developed with the assistance of AI tools for debugging, code suggestions, and UI creation:

- **Windsurf**: Debugging and troubleshooting assistance
- **ChatGPT**: UI creation and code improvements
- **Development Community**: Open source libraries and frameworks

##  Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

---

** Security Notice**: This is a development/educational project. For production use, ensure all security measures are properly configured and tested by security professionals.
