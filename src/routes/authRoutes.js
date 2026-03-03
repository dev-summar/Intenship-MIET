const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');
const { loginRules } = require('../validators/authValidator');

router.post('/login', validate(loginRules()), login);
router.get('/me', protect, getMe);

module.exports = router;
