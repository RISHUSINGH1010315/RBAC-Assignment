# RBAC Task Hub

An enterprise-grade, full-stack **Role-Based Access Control (RBAC)** Task Management application. Built using the MERN stack (MongoDB, Express, React, Node.js), this application displays security protocols, user directories, role updates, real-time statistics, and a system audit ledger.

---

## 🎨 Design Philosophy & Aesthetics
* **Theme**: Modern, flat corporate white theme.
* **Sharp Edges**: Strict usage of `border-radius: 0px` for a premium, structured corporate look.
* **Responsive Layout**: Custom media queries and flex wrap rules optimized to render perfectly across all device resolutions (Desktop, Tablet, Mobile) without any component overlaps.

---

## 🛠️ Technology Stack
* **Frontend**: React.js (Vite), Lucide Icons, Pure Vanilla CSS (custom variables).
* **Backend**: Node.js, Express.js (REST API, JWT Authentication, Custom Authorization Guards).
* **Database**: MongoDB Atlas (Cloud NoSQL DB).
* **Routing Rewrites**: Client-side navigation handled via `vercel.json` for seamless page refreshes.

---

## 🔐 Access Roles & Permissions Matrix

| Privilege / Action | Admin (`Rishu Admin`) | Manager (`Abhinit Manager`) | User (`Amit Sharma` / `Sneha Patel`) |
| :--- | :---: | :---: | :---: |
| **View Dashboard Stats** | ✅ | ✅ | ❌ |
| **View All Task Logs** | ✅ | ✅ | ❌ (Own assigned tasks only) |
| **Create New Tasks** | ✅ | ✅ | ❌ |
| **Edit/Modify Task Details** | ✅ | ✅ | ❌ |
| **Modify Task Status** | ✅ | ✅ | ✅ (Own assigned tasks only) |
| **Delete Tasks** | ✅ | ✅ | ❌ |
| **View Operative Directory** | ✅ | ❌ | ❌ |
| **Modify Operative Roles** | ✅ | ❌ | ❌ |
| **Revoke Operative Access** | ✅ | ❌ | ❌ |
| **View System Audit Ledger** | ✅ | ❌ | ❌ |

---

## 👥 Demo Access Credentials

All seed users share the password: **`password123`**

* **Admin Access**: 
  * Email: `admin@braviching.com`
  * Name: `Rishu Admin`
* **Manager Access**: 
  * Email: `manager@braviching.com`
  * Name: `Abhinit Manager`
* **User 1 Access**: 
  * Email: `user@braviching.com`
  * Name: `Amit Sharma`
* **User 2 Access**: 
  * Email: `sarah@braviching.com`
  * Name: `Sneha Patel`

---

## 🚀 Live Environment Configuration

* **Backend Live Base URL**: `https://rbac-assignment-vun8.onrender.com`
* **Database Access**: Whitelisted to accept global cloud connections (`0.0.0.0/0`) inside MongoDB Atlas to serve backend requests dynamically.
* **Frontend Deployment**: Automated via Vercel with single-page application routes redirection (`vercel.json`).

---

## 💻 Local Installation & Setup

### Prerequisite Configurations
Ensure you have **Node.js** (v18+ recommended) and **npm** installed.

### Step 1: Clone the Repository
```bash
git clone https://github.com/RISHUSINGH1010315/RBAC-Assignment.git
cd RBAC-Assignment
```

### Step 2: Configure Environment Variables

#### Backend Environment Settings (`backend/.env`)
Create a `.env` file inside the `backend` folder:
```env
PORT=5000
MONGODB_URI=mongodb+srv://rishusingh2902_db_user:SIkCdwkaGdv99wxP@cluster0.1y0cazi.mongodb.net/rbac_db?retryWrites=true&w=majority
JWT_SECRET=super_secure_operative_session_secret_key
NODE_ENV=production
```

#### Frontend Environment Settings (`frontend/.env`)
Create a `.env` file inside the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000
```

### Step 3: Seed the Database
Before launching the servers, execute the seeder script in the backend directory to populate users and test logs:
```bash
cd backend
npm install
npm run seed
```

### Step 4: Run the Application
Start both frontend and backend development servers.

* **Start Backend Server**:
  ```bash
  cd backend
  npm run dev
  ```
  *(Launches API gateway on `http://localhost:5000`)*

* **Start Frontend Dev Server**:
  ```bash
  cd ../frontend
  npm install
  npm run dev
  ```
  *(Launches Dev Client on `http://localhost:5173`)*

---

## ⚡ API Endpoint Guide

### Authentication Gate
* `POST /api/auth/login` - Authenticate operative and generate JWT session token.
* `GET /api/auth/me` - Fetch verified profile details of the logged-in operative.

### Task Operations
* `GET /api/tasks` - Fetch active task logs (Admins/Managers get all logs, Users get assigned items).
* `POST /api/tasks` - Record a new task (Admin & Manager privilege).
* `PUT /api/tasks/:id` - Update task details or change task status (Users can only update status).
* `DELETE /api/tasks/:id` - Remove a task from the logs ledger (Admin & Manager privilege).

### User Administration (Admin Only)
* `GET /api/users` - Fetch full user directory.
* `PUT /api/users/:id/role` - Reassign operative security clearance group (Admin/Manager/User).
* `DELETE /api/users/:id` - Remove operative record and revoke system access.

### System Audit Logs (Admin Only)
* `GET /api/logs` - Fetch system audit trail.
