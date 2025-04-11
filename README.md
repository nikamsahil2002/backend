# Backend API

This repository contains the backend implementation for managing users, projects, tasks, and categories.

> 🔄 **Note:**  
> - The main development code is in the `development` branch.  
> - The `test` branch is for testing purposes.  
> - The `main` branch is not actively used for latest updates.

## 🚀 Features

- User Authentication with JWT
- Role-Based Access Control (RBAC)
- Efficient Aggregation Pipelines for Optimized GET Requests
- Redis Implementation for Token Storage
- Common Reusable Utility Functions
- Proper Validation with express-validator
- Centralized and Structured Error Handling

## 🛠 Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- Redis
- JWT
- express-validator
- dotenv

## 📦 Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB running
- Redis running

### Installation

```bash
git clone https://github.com/nikamsahil2002/backend.git
cd backend
npm install


Environment Setup
PORT=3003
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

Start the Server
npm start

📁 Project Structure

backend/
├── bin/
├── config/
├── src/
├── utiles/
├── utils/
├── validators/
├── app.js
├── package.json
└── README.md

📌 API Endpoints

Auth
POST /api/auth/register – Register user
POST /api/auth/login – Login
POST /api/auth/logout – Logout

Projects
GET /api/projects
POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id

Tasks
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id

Categories
GET /api/categories
POST /api/categories
PUT /api/categories/:id
DELETE /api/categories/:id

🧪 Testing
Use Postman or any REST client to test endpoints. Auth routes require a Bearer token.
