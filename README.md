# Team Task Manager

This is a full-stack web application I built to manage team projects and tasks in a simple and organized way. The app allows users to create projects, assign tasks, and track progress with role-based access.

---

## 🚀 Live Demo

(Add your Railway live URL here)

## 💻 GitHub Repository

(Add your GitHub repo link here)

---

## 📌 Features

* User Authentication (Signup & Login)
* Role-based Access (Admin / Member)
* Create and manage projects
* Assign tasks to team members
* Update task status (Pending / In Progress / Completed)
* Dashboard to track overall progress and tasks

---

## 🛠 Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Deployment:** Railway

---

## ⚙️ How to Run Locally

### 1. Clone the repository

git clone (your-repo-link)

---

### 2. Install dependencies

**Backend:**
cd backend
npm install

**Frontend:**
cd frontend
npm install

---

### 3. Setup Environment Variables

Create a `.env` file inside the backend folder and add:

PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

> Note: Do not use actual credentials in public repositories.

For the frontend, copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL` to your backend API URL (e.g., `http://localhost:8000/api` for local development).

---

### 4. Run the project

**Backend:**
cd backend
node server.js

**Frontend:**
cd frontend
npm run dev

---

## 🚀 Deploy on Railway

### Backend Deployment

1. **Install Railway CLI** (optional) or use the web dashboard.
2. **Create a new Railway project** and link your GitHub repository.
3. **Add environment variables** in Railway:
   - `PORT` (optional, Railway assigns automatically)
   - `MONGO_URI` (your MongoDB connection string)
   - `JWT_SECRET` (a strong secret for JWT signing)
4. **Deploy**: Railway will automatically detect the `railway.json` configuration and deploy the backend.
5. **Get the backend URL** (e.g., `https://your-backend-service.up.railway.app`).

### Frontend Deployment

1. **Set the API URL**: In Railway, add environment variable `VITE_API_URL` pointing to your deployed backend URL (e.g., `https://your-backend-service.up.railway.app/api`).
2. **Deploy as a static site**:
   - Railway can serve the built frontend as a static site. You can use the "Static Files" service.
   - Alternatively, deploy using Vercel, Netlify, or Railway's Node.js service (with a simple server).
3. **Build command**: `npm run build`
4. **Output directory**: `dist`

### Using Railway's Multi‑Service Setup

If you want to deploy both backend and frontend as separate services within the same Railway project:

- Create a `railway.toml` file (optional) or use the web interface to add two services.
- Backend service: root directory `backend`, start command `npm start`.
- Frontend service: root directory `frontend`, build command `npm run build`, start command `npm run preview` (or use static serving).

### Post‑Deployment

- Update the **Live Demo** link in this README with your frontend URL.
- Ensure CORS is configured correctly (backend already allows all origins with `origin: "*"`).

---

## 📊 Project Overview

I built this project to strengthen my understanding of full-stack development. It helped me learn how frontend and backend systems connect, how APIs are created and used, and how role-based access works in real-world applications.

I focused on keeping the UI clean and making the application fully functional from end to end.

---

## 🎥 Demo Video

(Add your demo video link here)

---


