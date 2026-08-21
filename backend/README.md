# L.C.C. Coaching Backend API (Express.js)

REST API server for Lakshya Career Classes (L.C.C.).

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run in development mode:
```bash
npm run dev
```

3. Run in production:
```bash
npm start
```

## 📡 API Endpoints
- `GET  /api/health` - Server health check
- `GET  /api/courses` - List all courses
- `POST /api/courses` - Add new course (Admin)
- `POST /api/inquiries` - Submit student admission form
- `GET  /api/notices` - Fetch announcements & alerts
- `POST /api/admin/login` - Admin login verification (`admin123`)
