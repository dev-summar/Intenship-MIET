const express = require('express');
const router = express.Router();
const { getActiveAlumni } = require('../controllers/alumniController');

// Public alumni testimonials
router.get('/', getActiveAlumni);

module.exports = router;

