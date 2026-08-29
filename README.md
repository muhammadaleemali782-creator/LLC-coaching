# 🎓 Learning Coaching Center (L.C.C.) — Fullstack Architecture

This project is separated into **Frontend** and **Backend** folders:

```
lcc-coaching/
├── frontend/          # React + TypeScript + Vite + Tailwind CSS (Deploy to Vercel/Render)
│   ├── src/           # React Components & Context State
│   ├── public/assets/ # All images (Aman Arora photo, Hero poster, Debate images)
│   ├── vercel.json    # Vercel SPA routing configuration
│   ├── render.yaml    # Render Static Site configuration
│   └── package.json
│
└── backend/           # Node.js + Express REST API (Deploy to Render Web Service)
    ├── server.js      # Express server & API endpoints
    ├── .env.example   # Environment configuration
    ├── README.md
    └── package.json
```

---

## 🚀 1. How to Run Frontend Locally
```bash
cd frontend
npm install
npm run dev
```
Open **`http://127.0.0.1:5173/`**

---

## 🚀 2. How to Run Backend Locally
```bash
cd backend
npm install
npm run dev
```
Open **`http://localhost:5000/api/health`**

---

## 🌐 3. Deployment Instructions

### Deploy Frontend to Vercel:
1. Root Directory: `frontend`
2. Build Command: `npm run build`
3. Output Directory: `dist`

### Deploy Frontend to Render (Static Site):
1. Root Directory: `frontend`
2. Build Command: `npm run build`
3. Publish Directory: `dist`

### Deploy Backend to Render (Web Service):
1. Root Directory: `backend`
2. Build Command: `npm install`
3. Start Command: `npm start`
