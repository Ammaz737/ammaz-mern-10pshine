A full-stack MERN (MongoDB, Express, React, Node.js) application with user authentication, note-taking, and a clean responsive UI.

Getting Started

Follow these steps to run the project locally.

Prerequisites

Make sure you have:

Node.js v14+

npm

MongoDB (local or cloud)

Installation
# Clone the repository
git clone https://github.com/your-username/ammaz-mern-10pshine.git
cd ammaz-mern-10pshine

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

Environment Setup

Create a .env file inside the backend folder and add:

PORT=5000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>

Running the App
Backend
cd backend
npm run dev


Runs on: http://localhost:5000

Frontend
cd frontend
npm run dev


Runs on: http://localhost:5173

Tech Stack

Backend:

Node.js

Express

MongoDB + Mongoose

JWT Authentication

Bcrypt.js (password hashing)

Nodemailer (email service)

Jest (testing)

Frontend:

React (Vite)

Zustand (state management)

React Router

Tailwind CSS

Axios

Jest + React Testing Library

Folder Structure
.
├── backend
│   ├── controllers
│   ├── db
│   ├── middleware
│   ├── models
│   ├── routes
│   └── index.js
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── store
│   │   └── App.jsx
└── README.md

Testing

Backend:

cd backend
npm test


Frontend:

cd frontend
npm test
