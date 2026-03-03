const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from the project root .env
dotenv.config({ path: path.join(process.cwd(), '.env') });

const toNumber = (value, fallback) => {
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
};

const config = {
  port: toNumber(process.env.PORT, 5000),
  mongoUri: process.env.MONGO_URI,

  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '7d',
  },

  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

  rateLimit: {
    windowMs: toNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    max: toNumber(process.env.RATE_LIMIT_MAX_REQUESTS, 100),
  },

  seedAdmin: {
    email: process.env.SEED_ADMIN_EMAIL,
    password: process.env.SEED_ADMIN_PASSWORD,
    name: process.env.SEED_ADMIN_NAME,
  },

  pi360: {
    apiUrl: process.env.PI360_API_URL,
    instituteId: process.env.PI360_INSTITUTE_ID,
  },

  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    adminEmail: process.env.ADMIN_EMAIL,
  },

  uploadsDir: process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads'),
};

module.exports = config;

