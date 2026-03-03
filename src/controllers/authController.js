const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const logger = require('../utils/logger');

const PI360_API_URL = process.env.PI360_API_URL;
const PI360_INSTITUTE_ID = process.env.PI360_INSTITUTE_ID;

/** POST /api/auth/login — Student only (PI360). */
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return sendError(res, 'Username and password are required', 400);
  }

  if (!PI360_API_URL || !PI360_INSTITUTE_ID) {
    logger.error('PI360 integration is not configured');
    return sendError(res, 'Student login is temporarily unavailable', 503);
  }

  try {
    const response = await axios.post(
      `${PI360_API_URL}?institute_id=${encodeURIComponent(PI360_INSTITUTE_ID)}`,
      {
        username_1: username,
        password_1: password,
        fcm_token: '',
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );

    const payload = response.data || {};
    const statusCode = payload.statusCode;
    const piData = payload.data || {};

    if (statusCode !== 200) {
      if (statusCode === 204) {
        return sendError(res, 'Invalid credentials', 401);
      }
      if (statusCode === 202) {
        return sendError(res, 'Account is inactive', 403);
      }
      if (statusCode === 500) {
        logger.error('PI360 returned 500', payload);
        return sendError(res, 'PI360 service error', 500);
      }
      logger.warn('Unexpected PI360 statusCode', statusCode, payload);
      return sendError(res, 'Invalid credentials', 401);
    }

    const name = piData.name || 'Student';
    const email = (piData.username || '').toString().toLowerCase().trim();

    if (!email) {
      logger.warn('PI360 login success response missing username/email', payload);
      return sendError(res, 'Invalid credentials', 401);
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        role: 'student',
        instituteId: PI360_INSTITUTE_ID,
      });
    } else if (user.role !== 'student') {
      return sendError(res, 'Invalid credentials', 401);
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return sendSuccess(res, 'Login successful', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    const statusCode = error.response?.data?.statusCode;

    logger.error('PI360 login error', {
      message: error.message,
      status: error.response?.status,
      statusCode,
    });

    if (statusCode === 204) {
      return sendError(res, 'Invalid credentials', 401);
    }
    if (statusCode === 202) {
      return sendError(res, 'Account is inactive', 403);
    }
    if (statusCode === 500) {
      return sendError(res, 'PI360 service error', 500);
    }

    return sendError(res, 'Invalid credentials', 401);
  }
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  return sendSuccess(res, '', { user });
});

module.exports = {
  login,
  getMe,
};
