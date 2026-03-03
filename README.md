# Internship Management Portal – Backend

Production-ready Node.js backend for an Internship Management Portal with JWT auth, role-based access, projects, and applications.

## Tech Stack

- **Node.js** & **Express.js**
- **MongoDB** (Mongoose)
- **JWT** (jsonwebtoken)
- **bcryptjs** – password hashing
- **dotenv** – environment config
- **Helmet** – security headers
- **CORS** – allowed origin from env
- **Morgan** – HTTP logging
- **express-validator** – input validation
- **express-mongo-sanitize** – NoSQL injection protection
- **express-rate-limit** – rate limiting

## Project Structure

```
src/
├── server.js              # Entry point, DB connect, graceful shutdown
├── app.js                 # Express app, middleware, routes
├── config/
│   ├── db.js              # MongoDB connection
│   └── index.js           # Env config & validation
├── controllers/
│   ├── authController.js
│   ├── projectController.js
│   └── applicationController.js
├── routes/
│   ├── authRoutes.js
│   ├── projectRoutes.js
│   └── applicationRoutes.js
├── models/
│   ├── User.js
│   ├── Project.js
│   └── Application.js
├── middleware/
│   ├── authMiddleware.js  # JWT protect
│   ├── roleMiddleware.js  # authorize(roles)
│   ├── errorHandler.js    # Central error + 404
│   └── validate.js        # express-validator wrapper
├── validators/
│   ├── authValidator.js
│   ├── projectValidator.js
│   └── applicationValidator.js
└── utils/
    ├── apiResponse.js     # sendSuccess / sendError
    ├── asyncHandler.js
    └── logger.js
```

## Setup

1. **Clone and install**

   ```bash
   cd Director-Internship-Manger
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and set values:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/internship_portal
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:3000
   ```

   Optional:

   ```env
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Run**

   ```bash
   npm run dev   # development with watch
   npm start     # production
   ```

## API Overview

### Response format

- Success: `{ "success": true, "message": "", "data": {} }`
- Error: `{ "success": false, "message": "..." }` (optional `data` for validation errors)

### Authentication (`/api/auth`)

| Method | Endpoint    | Description        | Access   |
|--------|-------------|--------------------|----------|
| POST   | /register   | Register user      | Public   |
| POST   | /login      | Login, get JWT     | Public   |
| GET    | /me         | Current user       | Protected|

**Roles:** `admin`, `student`, `faculty` (default: `student`).

Send JWT in header: `Authorization: Bearer <token>`.

### Projects (`/api/projects`)

| Method | Endpoint | Description      | Access        |
|--------|----------|------------------|---------------|
| GET    | /        | List all projects| Protected     |
| GET    | /open    | Open projects    | Protected     |
| GET    | /:id     | Project by ID    | Protected     |
| POST   | /        | Create project   | Admin only    |
| PUT    | /:id     | Update project   | Admin only    |
| DELETE | /:id     | Delete project   | Admin only    |

Query: `?page=1&limit=10` for list/open.

### Applications (`/api/applications`)

| Method | Endpoint        | Description           | Access           |
|--------|-----------------|-----------------------|------------------|
| POST   | /               | Apply to project      | Student          |
| GET    | /my             | My applications       | Student          |
| GET    | /all            | All applications      | Admin, Faculty   |
| GET    | /:id            | Application by ID     | Owner / Admin / Faculty |
| PUT    | /:id/decision   | Approve / Reject       | Admin only       |

Decision body: `{ "status": "approved"|"rejected", "remarks": "", "assignedMentor": "userId" }` (mentor optional on approval).

## Security

- **Helmet** – security headers
- **CORS** – origin from `CLIENT_URL`
- **Rate limiting** – configurable via env
- **JWT** – protected routes and role checks
- **Input validation** – express-validator on all inputs
- **Mongo sanitize** – prevents `$` and `.` in input
- **No hardcoded secrets** – all from `.env`

## Health Check

- `GET /health` → `{ "success": true, "message": "OK", "data": { "status": "healthy" } }`

## License

MIT.
