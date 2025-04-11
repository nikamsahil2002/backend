# Task Management

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
DB_DEV_URL=mongodb://localhost:27017/task-manager
EMAIL_USER=your-email
EMAIL_PASSWORD=your-gmail-app-password
REDIS_PORT=localhost
REDIS_HOST=6379
PORT=3003

Start the Server
npm start

📁 Project Structure

backend/
├── bin/
├── config/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── services/
├── utiles/
├── utils/
├── docs/
│   └── postman_collection.json
├── validators/
├── app.js
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

Users
GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id

Teams
GET /api/teams
POST /api/teams
PUT /api/teams/:id
DELETE /api/teams/:id

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

Let me know if you want a copy of this file or need it directly pushed to the repo.

