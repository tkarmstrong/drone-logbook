# Drone Logbook

A drone flight logbook app with a React frontend and Express + MongoDB backend.

## Stack

- **Frontend**: React, React Router, React Query (TanStack Query), Vite, TypeScript
- **Backend**: Express, MongoDB (Mongoose), JWT auth

## Prerequisites

- Node.js 16+
- MongoDB Atlas (or local MongoDB)

## Setup

1. Clone the repo and install dependencies:

   ```bash
   npm install
   ```

2. Create `server/config.js` with your database credentials and JWT secret (use `server/config.js.example` as a template if provided).

3. Ensure MongoDB Atlas connection string in `server/app.js` matches your cluster hostname.

## Development

- **Frontend dev server** (Vite, hot reload, proxies `/api` to backend):

  ```bash
  npm run dev
  ```

  Open http://localhost:5173

- **Backend only** (Express + MongoDB, serves built frontend if present):

  ```bash
  npm run server
  ```

  Runs on http://localhost:3000

- **Full app** (build frontend + start backend):

  ```bash
  npm run localhost
  ```

  Serves the app at http://localhost:3000

## Build

```bash
npm run build
```

Output is in `dist/drone-logbook`. The Express server serves these static files.

## Project Structure

```
├── src/                 # React frontend (Vite)
│   ├── api/             # API client and React Query hooks
│   ├── components/
│   ├── pages/
│   └── main.tsx
├── server/              # Express backend
│   ├── controllers/
│   ├── models/
│   └── app.js
└── dist/drone-logbook/  # Built frontend (after npm run build)
```
