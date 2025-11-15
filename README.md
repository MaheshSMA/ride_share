# Mail EL 5th Sem - Express + React Authentication App

A full-stack application with Express.js backend and React frontend, featuring user signup, login, email verification, and role selection functionality.

## Project Structure

```
mail_el_5th_sem_repo/
├── backend/              # Express.js backend
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Email service
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API service
│   │   └── App.js
│   └── package.json
└── README.md
```

## Features

- ✅ User signup with validation (name, username, password, age, gender, email)
- ✅ User login with email and password
- ✅ Email verification using nodemailer
- ✅ MongoDB storage for user data
- ✅ Role selection (Captain/Customer) after authentication
- ✅ JWT-based authentication
- ✅ Beautiful, modern React UI
- ✅ Separate frontend and backend folders

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)
- Email account for sending verification emails (Gmail recommended)

## Installation

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mail_el_db
JWT_SECRET=your-jwt-secret-key-here-change-in-production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
CLIENT_URL=http://localhost:3000
BASE_URL=http://localhost:5000
```

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies (already done if you used create-react-app):
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api/auth
```

### Gmail Setup (for email verification)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `EMAIL_PASS` in your backend `.env` file

## Running the Application

### Development Mode

1. Start the backend server (from `backend` folder):
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

2. Start the frontend (from `frontend` folder in a new terminal):
```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000`

### Production Mode

1. Build the React app:
```bash
cd frontend
npm run build
```

2. Start the backend:
```bash
cd backend
npm start
```

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email?token=<token>` - Email verification
- `GET /api/auth/me` - Get current user (requires authentication)
- `POST /api/auth/role-selection` - Select user role (requires authentication)
- `GET /api/health` - Health check

## Database Schema

The `users` collection contains documents with the following fields:
- `name` (String, required)
- `username` (String, required, unique)
- `password` (String, required, hashed)
- `age` (Number, required)
- `gender` (String, required, enum: ['male', 'female', 'other'])
- `mail` (String, required, unique)
- `isEmailVerified` (Boolean, default: false)
- `emailVerificationToken` (String)
- `role` (String, enum: ['captain', 'customer'], default: null)
- `createdAt` (Date, auto-generated)
- `updatedAt` (Date, auto-generated)

## User Flow

1. **Signup**: User creates an account with name, username, password, age, gender, and email
2. **Email Verification**: User receives verification email and clicks the link
3. **Role Selection**: After verification/login, user selects role (Captain or Customer)
4. **Dashboard**: User is redirected to dashboard based on their role

## Notes

- Usernames must be unique
- Emails must be unique
- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- Email verification is required before role selection
- Role selection backend functionality will be implemented later

## Technologies Used

### Backend
- Express.js
- MongoDB with Mongoose
- bcryptjs for password hashing
- jsonwebtoken for JWT authentication
- nodemailer for email service
- cors for cross-origin requests

### Frontend
- React
- React Router for routing
- Axios for API calls
- CSS for styling

