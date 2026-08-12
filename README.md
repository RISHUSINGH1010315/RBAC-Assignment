# RBAC Task Management System

A premium **Role-Based Access Control (RBAC)** full-stack web application. Designed with a clean, flat corporate white theme featuring sharp corners (`border-radius: 0px`), responsive layout adjustments for all viewport sizes, and comprehensive security controls.

---

## Tech Stack
* **Frontend**: React (Vite) + Lucide Icons + Custom CSS Layout Variables (Flat Corporate Theme)
* **Backend**: Node.js + Express (REST API)
* **Database**: MongoDB Atlas (Cloud NoSQL Cluster)
* **Authentication**: JSON Web Token (JWT) + bcryptjs password encryption

---

## Access Roles & Demo Credentials

The system seeds the database with the following demo operatives:

1. **Admin (Rishu Admin)**
   * **Permissions**: Full Task CRUD (Create, Read, Update, Delete), Operative Directory Management (Change roles, delete users/revoke access), view Statistics, and access to System Audit Logs.
   * **Demo Email**: `admin@braviching.com`
   * **Password**: `password123`

2. **Manager (Abhinit Manager)**
   * **Permissions**: Full Task CRUD (Create, Read, Update, Delete) and Statistics. *Cannot modify user roles or delete users/revoke access.*
   * **Demo Email**: `manager@braviching.com`
   * **Password**: `password123`

3. **User (Amit Sharma / Sneha Patel)**
   * **Permissions**: Access to see tasks assigned specifically to them. Can only change the **Status** (Pending, In Progress, Completed) of their own tasks. *Cannot create/delete tasks or change assignments.*
   * **Demo Email**: `user@braviching.com` (Amit Sharma) / `sarah@braviching.com` (Sneha Patel)
   * **Password**: `password123`

---

## Live Deployment Details

* **Backend Live URL (Render)**: `https://rbac-assignment-vun8.onrender.com`
* **Database Cluster (MongoDB Atlas)**: Configured with custom whitelist rule `0.0.0.0/0` to allow secure access from Render nodes.

---

## Local Setup & Installation

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your `.env` file (e.g. `MONGODB_URI`, `JWT_SECRET`, `PORT`).
4. Seed the database with initial users and tasks:
   ```bash
   npm run seed
   ```
5. Run the server in development mode (runs on `http://localhost:5000`):
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your environment variables in `.env` (e.g. `VITE_API_URL=http://localhost:5000`).
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

---

## Key Features & Customizations

1. **Flat Corporate White Theme**: Built using clean white cards, subtle borders, high contrast elements, and straight sharp edges (`border-radius: 0px`).
2. **Dynamic Role-Based UI Rendering**: Header tab panels, Action buttons (like Create Task or Revoke Access), and data visibility are strictly dictated by the user's role.
3. **Audit Log System**: Tracks administrative operations, login trails, and task adjustments.
4. **Responsive Mobile layout**: Optimised via modern CSS media queries to stack smoothly on mobile viewports (e.g. smartphones and tablets) without element overlapping or container breakage.
