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

🧠 Project Logic & Approach
🔐 Role-Based Access Control (RBAC)
Each user has a role (Admin, Manager, Team Lead, Member).
Access to routes and actions is controlled via middleware that checks the user’s role.
Only authorized roles can perform certain actions (e.g., only Admin can manage users; Team Leads can create tasks).

🧱 Project → Team → Task Flow
🧑‍🤝‍🧑 Teams
Teams consist of:
Team Lead
Team Members

📁 Projects
A project is assigned to a Team.
Only the Team Lead of the assigned team can create and manage tasks for that project.

✅ Tasks
Team Leads can create tasks under the assigned project.
Tasks can be assigned to one or more team members.
Task data includes priority, start date, due date, recurrence, etc.
also task members can add comments on tasks, update status of the task.

🔁 Task Recurrence Logic
When a task is created and assigned, a corresponding entry is created in the taskRecurrence collection.

The recurrence type can be:
once
daily
weekly
monthly

⏰ Cron Job for Recurring Tasks
A cron job runs every day at 00:01 AM.
It looks for due entries in the taskRecurrence collection.
For each due entry:
It duplicates the original task for the current date.
Inserts a new task in the tasks collection.
Updates the nextRun field based on the recurrence type (e.g., add 1 day for daily).

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

🔧 Steps to Add Postman Collection
Open Postman, click on your collection.

Click the three dots (⋮) → Export.

Choose format: Collection v2.1 (recommended).

Save it as: postman_collection.json

Move that file to the docs/ folder inside your project.


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

Task Recurrence
GET /api/taskRecurrence – Get all recurrence records
POST /api/taskRecurrence – Create a recurrence pattern
GET /api/taskRecurrence/:id – Get a specific recurrence
PUT /api/taskRecurrence/:id – Update a recurrence
DELETE /api/taskRecurrence/:id – Delete a recurrence

Categories
GET /api/categories
POST /api/categories
PUT /api/categories/:id
DELETE /api/categories/:id

🧪 Testing
Use Postman or any REST client to test endpoints. Auth routes require a Bearer token.

Let me know if you want a copy of this file or need it directly pushed to the repo.
