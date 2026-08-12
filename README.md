# RBAC Task Management System

A premium dark glassmorphic full-stack web application demonstrating **Role-Based Access Control (RBAC)**. Built using React.js (Vite), Node.js (Express), and MongoDB Atlas.

## Tech Stack
* **Frontend**: React (Vite) + Lucide Icons + Custom CSS Layout Variables
* **Backend**: Node.js + Express
* **Database**: MongoDB Atlas (Cloud NoSQL)
* **Authentication**: JSON Web Token (JWT) with bcryptjs password encryption

---

## Access Roles & System Permissions

The system handles three distinct roles:

1. **Admin (Rishu Admin)**
   * **Permissions**: Access to all tasks, full task CRUD (Create, Read, Update, Delete), change roles of other users, delete users, and view statistics.
   * **Demo Email**: `admin@braviching.com`
   * **Password**: `password123`

2. **Manager (Abhinit Manager)**
   * **Permissions**: Access to all tasks, task CRUD (Create, Read, Update, Delete). *Cannot modify user roles or delete users.*
   * **Demo Email**: `manager@braviching.com`
   * **Password**: `password123`

3. **User (John Developer / Sarah Tester)**
   * **Permissions**: Can only view tasks assigned specifically to them. Can only change the **Status** (Pending, In Progress, Completed) of their own tasks. *Cannot create/delete tasks or change other fields.*
   * **Demo Email**: `user@braviching.com` (John) / `sarah@braviching.com` (Sarah)
   * **Password**: `password123`

---

## Local Setup & Installation

Follow these steps to run both backend and frontend locally:

### 1. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Run the development server (runs on `http://localhost:5000`):
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open the displayed URL in your browser (usually `http://localhost:5173`).

---

## Core Security & Design Assumptions

* **Database Security**: All passwords are encrypted on-write using standard `bcrypt` hashing before saving to the Atlas collection.
* **Server-Side Authorization**: API routes (such as updating user roles or deleting tasks) are guarded by JWT decoding. The server validates that the requesting token belongs to an authorized user role (`Admin` or `Manager`) before processing database modifications.
* **Responsive Fluid Design**: Built with a customizable dark CSS grid palette utilizing micro-animations, glassmorphic card overlays, and dynamic visual indicators.
