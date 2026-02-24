# 🔐 Next.js JWT Authentication System

A production-ready authentication system built using **Next.js (App Router)**, **MongoDB**, and **JWT (Access + Refresh Tokens)**.

This project demonstrates:

- Access Token (short-lived)
- Refresh Token (httpOnly cookie)
- Token rotation
- API 401 retry with refresh
- Protected pages & role-based authorization
- Client-side auth wrapper
- Clean folder structure

---

## 🚀 Tech Stack

**Frontend**

- Next.js 16+
- React 19
- TypeScript
- Tailwind CSS
- Context API for Auth State

**Backend / API**

- Next.js API Routes
- MongoDB Atlas
- Mongoose ODM
- bcrypt (password hashing)
- jsonwebtoken (JWT)
- Zod (input validation)

---

## 🔄 Authentication Flow

### 1️⃣ Register

**POST /api/auth/register**

- Validates user input using Zod
- Hashes password with bcrypt
- Stores user in MongoDB
- Assigns default role (`user`)
- Returns success message

### 2️⃣ Login

**POST /api/auth/login**

- Validates credentials
- Generates:
  - Access Token (short-lived)
  - Refresh Token (long-lived, stored in DB)
- Sets refresh token in httpOnly cookie
- Returns access token and user object

### 3️⃣ Access Protected Routes

- Frontend uses **authFetch wrapper** to call API
- Attaches `Authorization: Bearer <accessToken>`
- On `401 Unauthorized`:
  - Calls `/api/auth/refresh`
  - Sets new access token
  - Retries original request once
- Logs out if refresh fails

### 4️⃣ Refresh Token

**POST /api/auth/refresh**

- Reads refresh token from httpOnly cookie
- Validates token and user
- Generates new access token
- Rotates refresh token in DB
- Returns new access token

### 5️⃣ Logout

**POST /api/auth/logout**

- Removes refresh token from DB
- Clears httpOnly cookie
- Clears access token from memory

---

## 🛡 Security Features

- Password hashing with bcrypt
- Access token stored in memory only
- Refresh token stored in httpOnly cookie
- Refresh token rotation
- 401 auto-retry with max one retry
- Forced logout when refresh expires
- Role-based authorization

---

## 🗂 Folder Structure

    app/
    layout.tsx → Root layout with AuthProvider
    (protected)/
    layout.tsx → Protected layout
    dashboard/
    settings/

    api/
    auth/
    login/route.ts
    register/route.ts
    refresh/route.ts
    logout/route.ts
    me/route.ts

    components/
    Navbar.tsx → Navbar with links, user info, logout

    context/
    AuthContext.tsx → Auth state, access token, login, logout

    lib/
    authFetch.ts → Client fetch wrapper with refresh
    jwt.ts → JWT sign/verify helpers
    db.ts → MongoDB connection

    models/
    User.ts → User schema/model


---

## 🧠 Key Concepts

- **Silent Refresh:** On app load, refreshes session automatically if refresh token exists.  
- **401 Auto Retry:** Access token expiration triggers refresh + retry once.  
- **Token Rotation:** Refresh token is replaced on every refresh call.  
- **Protected Layout:** Routes under `(protected)` layout only accessible if authenticated.  
- **Role-Based Authorization:** User roles can control access to certain pages.

---

## 📜 Environment Variables

Create `.env.local`:
    MONGODB_URI=your_mongodb_connection_string
    JWT_ACCESS_SECRET=your_access_secret
    JWT_REFRESH_SECRET=your_refresh_secret

---

## 📊 Database Schema (User)

```ts
{
  email: string,
  password: string,
  role: string,
  refreshTokens: string[],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 💻 Scripts

    npm run dev      → Run development server
    npm run build    → Build production version
    npm run start    → Start production server
    npm run lint     → Run ESLint
---

## 🔄 authFetch Example

    import { authFetch } from "@/lib/authFetch";
    import { useAuth } from "@/context/AuthContext";

    const { accessToken, setAccessToken } = useAuth();

    const response = await authFetch("/api/protected/data", {}, accessToken, setAccessToken, logout);
    const data = await response.json();

---

## 🖥 Navbar Example

```ts

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between p-4 bg-gray-800 text-white">
      <div className="space-x-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/settings">Settings</Link>
      </div>
      <div className="flex items-center space-x-4">
        <span>{user?.email}</span>
        <button onClick={logout} className="bg-red-600 px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}

```

---
## 🏆 Why Production-Ready

    - No localStorage JWT storage
    - Max retry on 401 to prevent infinite loop
    - Refresh token rotation
    - Centralized fetch wrapper
    - Forced logout on expired refresh token
    - Clean API and frontend separation
    - Role-based access control
---

## 🚀 Future Improvements
- Device/session tracking
- Logout all devices
- Redis token blacklist
- OAuth login (Google/Github)
- Audit logging
- Rate limiting on auth routes