# 🛠️ FixMyCity

FixMyCity is a civic issue reporting and tracking platform that empowers citizens to report and monitor problems in their locality, such as potholes, garbage dumps, broken streetlights, and more.

It features a modern interface for both users and admins, and includes login, issue tracking, and profile management, all backed by Firebase authentication and a Node.js + Express backend.

---

## 🔗 Live Demo

- **Frontend (React):** [https://fixmycity.vercel.app](https://fixmycity.vercel.app) *(Update after deployment)*
- **Backend (Express API):** [https://fixmycity-api.onrender.com](https://fixmycity-api.onrender.com) *(Update after deployment)*

---

## 📦 Tech Stack

### 🌐 Frontend
- React.js
- React Router
- Tailwind CSS / CSS Modules
- Firebase Authentication
- Axios
- Vercel (Deployment)

### 🖥️ Backend
- Node.js
- Express.js
- MongoDB
- Firebase Admin SDK (for user management)
- Render (Deployment)

---

## 🔐 Features

### ✅ User
- Register/Login via Firebase Auth
- OTP-based password reset via email
- Persistent login (via `localStorage`)
- Profile with dynamic avatar (random or email letter)
- Dashboard with:
  - Profile view/edit
  - Tracked submitted issues (status updates)
  - View upvoted issues

### ⚙️ Admin
- Separate dashboard (planned/deploying)
- Review submitted issues
- Change issue status (in progress, resolved, etc.)

### 📲 UX Features
- Modal-based login/registration
- Smooth transitions between login/register
- Mobile responsive design
- Eye icon for password visibility
- Real-time UI updates based on login status

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the Repo

```bash
git clone https://github.com/koppadipranaykumar/FixMyCity.git
cd FixMyCity
