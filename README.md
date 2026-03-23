# Kodemy — Learning Management System

A modern, production-ready LMS built with Next.js 14, Express, TypeScript, Prisma, and SQLite.

## Features

✨ **Core Features**
- User authentication with JWT (access + refresh tokens)
- 6 expert courses with 18+ videos
- Video locking system (sequential unlock on completion)
- Progress tracking (auto-save every 5 seconds)
- YouTube video player with resume functionality
- Responsive course syllabus with collapsible sections
- AI Assistant chatbot (rule-based)

🎯 **Tech Stack**
- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Zustand, Axios
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: SQLite (dev), MySQL (production)
- **Auth**: JWT with HTTP-only cookies + refresh token rotation

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Backend Setup

```bash
cd lms/backend
npm install
npx prisma migrate dev --name init
npx ts-node-dev --transpile-only prisma/seed.ts
npm run dev
```

Backend runs on `http://localhost:4000`

**Demo credentials:**
- Email: `demo@example.com`
- Password: `password123`

### 2. Frontend Setup

```bash
cd lms/frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## Project Structure

```
lms/
├── backend/
│   ├── src/
│   │   ├── modules/          # Feature modules (auth, subjects, videos, progress)
│   │   ├── middleware/       # Auth, error handling, validation
│   │   ├── utils/            # JWT, ordering logic, Prisma client
│   │   ├── app.ts            # Express app setup
│   │   └── index.ts          # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.ts           # Seed script with 6 courses
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── app/              # Next.js pages (App Router)
    │   ├── components/       # React components
    │   ├── store/            # Zustand stores (auth, video, sidebar)
    │   ├── lib/              # API client, helpers
    │   └── types/            # TypeScript interfaces
    ├── package.json
    └── tsconfig.json
```

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Sign in
- `POST /api/auth/refresh` — Refresh access token
- `POST /api/auth/logout` — Sign out

### Subjects
- `GET /api/subjects` — List all courses
- `GET /api/subjects/:id` — Get course details
- `GET /api/subjects/:id/tree` — Get full syllabus (auth required)
- `GET /api/subjects/:id/first-video` — Get first video (auth required)
- `POST /api/subjects/:id/enroll` — Enroll in course (auth required)

### Videos
- `GET /api/videos/:videoId` — Get video details (auth required)

### Progress
- `GET /api/progress/videos/:videoId` — Get video progress (auth required)
- `POST /api/progress/videos/:videoId` — Update video progress (auth required)
- `GET /api/progress/subjects/:subjectId` — Get course progress (auth required)

### Health
- `GET /api/health` — Server status

---

## Database Schema

### User
- `id` (PK)
- `email` (unique)
- `passwordHash`
- `name`
- `createdAt`, `updatedAt`

### Subject
- `id` (PK)
- `title`
- `slug` (unique)
- `description`
- `thumbnail`
- `isPublished`
- `createdAt`, `updatedAt`

### Section
- `id` (PK)
- `subjectId` (FK)
- `title`
- `orderIndex`
- Unique constraint: `(subjectId, orderIndex)`

### Video
- `id` (PK)
- `sectionId` (FK)
- `title`
- `description`
- `youtubeUrl`
- `orderIndex`
- `durationSeconds`
- Unique constraint: `(sectionId, orderIndex)`

### Enrollment
- `id` (PK)
- `userId` (FK)
- `subjectId` (FK)
- Unique constraint: `(userId, subjectId)`

### VideoProgress
- `id` (PK)
- `userId` (FK)
- `videoId` (FK)
- `lastPositionSeconds`
- `isCompleted`
- `completedAt`
- Unique constraint: `(userId, videoId)`

### RefreshToken
- `id` (PK)
- `userId` (FK)
- `tokenHash` (unique)
- `expiresAt`
- `revokedAt`

---

## Courses Included

1. **JavaScript Fundamentals** — Variables, functions, async/await
2. **TypeScript Masterclass** — Types, interfaces, generics, decorators
3. **React Complete Guide** — Components, hooks, state management
4. **Python Full Course** — Basics, OOP, file handling, APIs
5. **Docker in 2 Hours** — Containers, images, Docker Compose
6. **SQL in 4 Hours** — SELECT, JOINs, subqueries, indexes

---

## Key Features Explained

### Video Locking
Videos are flattened across all sections by `section.orderIndex` then `video.orderIndex`. The first video is always unlocked. Subsequent videos unlock only when the previous video is marked complete.

### Progress Tracking
- Player saves position every 5 seconds (debounced)
- On video end → auto-mark complete → auto-navigate to next video
- Progress % shown on course page

### JWT Auth
- **Access Token**: 15 minutes (in-memory, Authorization header)
- **Refresh Token**: 30 days (HTTP-only cookie, auto-rotated)
- On 401 → auto-refresh → retry request

### AI Assistant
Rule-based chatbot with suggestions for:
- Course recommendations
- Platform features (locking, progress, pricing)
- Course content overview

---

## Environment Variables

### Backend (`.env`)
```
DATABASE_URL="file:./dev.db"
JWT_ACCESS_SECRET="min-32-char-random-string"
JWT_REFRESH_SECRET="different-min-32-char-random-string"
FRONTEND_URL="http://localhost:3000"
PORT=4000
NODE_ENV=development
```

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## Deployment

### Backend (Render)
1. Connect GitHub repo
2. Set root directory: `lms/backend`
3. Build: `npm install && npm run db:generate && npm run build`
4. Start: `npm run db:migrate && npm start`
5. Add env vars: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_URL`

### Frontend (Vercel)
1. Connect GitHub repo
2. Set root directory: `lms/frontend`
3. Add env var: `NEXT_PUBLIC_API_URL` (your Render backend URL)

### Database (Aiven MySQL)
1. Create MySQL service
2. Copy connection string to `DATABASE_URL` with `?ssl-mode=REQUIRED`

---

## Development

### Run both servers
```bash
# Terminal 1
cd lms/backend && npm run dev

# Terminal 2
cd lms/frontend && npm run dev
```

### Seed database
```bash
cd lms/backend
npx ts-node-dev --transpile-only prisma/seed.ts
```

### TypeScript check
```bash
# Backend
cd lms/backend && npx tsc --noEmit

# Frontend
cd lms/frontend && npx tsc --noEmit
```

---

## License

MIT

---

## Support

For issues or questions, open a GitHub issue or contact the development team.

Happy learning! 🚀
