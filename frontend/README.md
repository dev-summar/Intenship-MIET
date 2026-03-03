# Internship Portal – Frontend

React (Vite) frontend with Tailwind, React Router, React Query, and Recharts.

## Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Set in `.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Run

```bash
npm run dev    # dev server (port 3000)
npm run build  # production build
npm run preview  # preview production build
```

## Stack

- **Vite** + **React 18**
- **Tailwind CSS**
- **React Router v6**
- **Axios** (base URL from `VITE_API_BASE_URL`, JWT interceptor)
- **React Query** (API state)
- **Context API** (Auth)
- **Recharts** (admin analytics)
- **react-hot-toast** (notifications)

All copy and routes live in `src/constants/messages.js`. No hardcoded API URLs; use `import.meta.env.VITE_API_BASE_URL`.
