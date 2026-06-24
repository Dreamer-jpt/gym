# FitTrack Pro

A modern MERN stack gym tracking web application. Track workouts, exercises, body progress, goals, personal records, and view detailed analytics.

## Tech Stack

**Frontend:** React (Vite), React Router, Tailwind CSS, Axios, Recharts, React Hook Form, Zod, Lucide React, React Hot Toast

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Helmet, CORS, Rate Limiting, Morgan

**Deployment:** Frontend on Vercel, Backend on Render, Database on MongoDB Atlas

## Project Structure

`
fittrack-pro/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Auth & Theme context
│   │   ├── pages/        # Page components
│   │   ├── routes/       # Route definitions
│   │   ├── services/     # API service layer
│   │   ├── hooks/        # Custom hooks
│   │   ├── utils/        # Helper functions
│   │   └── constants/    # App constants
│   └── ...
├── server/          # Express backend
│   ├── src/
│   │   ├── config/       # Database config
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/    # Auth, error handling
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   ├── validators/   # Zod schemas
│   │   └── utils/        # Seed data
│   └── ...
└── README.md
`

## Features

- **Authentication** - Register, login, logout with JWT and HTTP-only cookies
- **Dashboard** - Workout summary, stats, streak tracking, quick actions
- **Workout Management** - Create, edit, delete workouts with exercise tracking
- **Exercise Library** - Default exercises + custom exercise creation
- **Body Progress** - Track weight, body fat, and body measurements with charts
- **Goal Setting** - Set fitness goals with progress tracking
- **Analytics** - Volume trends, muscle group distribution, weight progress, personal records
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Mobile, tablet, and desktop optimized

## Local Development Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the repository

`ash
git clone <your-repo-url>
cd fittrack-pro
`

### 2. Backend Setup

`ash
cd server
npm install
`

Create \server/.env\:

`
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
`

Seed default exercises:

`ash
npm run seed
`

Start backend:

`ash
npm run dev
`

### 3. Frontend Setup

`ash
cd client
npm install
`

Create \client/.env\:

`
VITE_API_BASE_URL=http://localhost:5000/api
`

Start frontend:

`ash
npm run dev
`

Visit http://localhost:5173

## Deployment

### Deploy Backend on Render

1. Push code to GitHub
2. Go to render.com and create a new Web Service
3. Connect your GitHub repository
4. Configure:
   - Name: fittrack-pro-api
   - Root Directory: server
   - Build Command: npm install
   - Start Command: npm start
5. Add environment variables
6. Deploy

### Deploy Frontend on Vercel

1. Push code to GitHub
2. Go to vercel.com and import your repository
3. Configure:
   - Root Directory: client
   - Build Command: npm run build
   - Output Directory: dist
4. Add VITE_API_BASE_URL
5. Deploy

### Environment Variables

**Server (.env):**
- PORT=5000 (or 10000 for Render)
- NODE_ENV=production
- MONGO_URI=your_mongodb_atlas_connection_string
- JWT_SECRET=strong_secret_key
- JWT_EXPIRES_IN=7d
- CLIENT_URL=https://your-vercel-app.vercel.app

**Client (.env):**
- VITE_API_BASE_URL=https://your-render-app.onrender.com/api

## Security

- JWT stored in HTTP-only cookies
- Passwords hashed with bcrypt (12 rounds)
- Rate limiting on auth routes
- Helmet for secure headers
- CORS configured with whitelist
- All routes protected with auth middleware
- Users can only access their own data
- No secrets exposed to frontend
