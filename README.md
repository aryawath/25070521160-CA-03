# Arya Flexi — Full Stack E-Commerce Project

A full-stack web application with a React (Vite) frontend and an Express + MongoDB backend.

## 📁 Project Structure

```
├── client/    # React + Vite frontend
└── server/    # Express + MongoDB backend
```

## ✅ Requirements (install these first)

- [Node.js v18+](https://nodejs.org/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (local)

> Make sure MongoDB is **running** on your PC before starting the server.

---

## 🚀 How to Run Locally (after cloning)

### 1. Clone the repo
```bash
git clone https://github.com/aryawath/25070521160-CA-03.git
cd 25070521160-CA-03
```

### 2. Start the Server (Backend)
```bash
cd server
npm install
copy .env.example .env
npm run dev
```
✅ Server starts at: `http://localhost:5000`

### 3. Start the Client (Frontend) — new terminal
```bash
cd client
npm install
npm run dev
```
✅ Website opens at: `http://localhost:5173`

---

## 🌱 Seed Sample Products (optional)
To add sample product data to the database:
```bash
cd server
npm run seed
```

---

## ⚙️ Environment Variables

The `.env.example` files already have the correct values for local use.
Just copy them:

```bash
# In server folder:
copy .env.example .env

# In client folder:
copy .env.example .env
```

No changes needed — it works out of the box with local MongoDB.

---

## 🗂️ Tech Stack

| Part | Technology |
|------|-----------|
| Frontend | React 18, Vite, React Router, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Styling | CSS (custom) |
