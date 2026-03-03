const express = require('express');
const router = express.Router();
const { apply, getMyApplications } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validate');
const { applyRules } = require('../validators/applicationValidator');

router.post('/', protect, authorize('student'), validate(applyRules()), apply);
router.get('/my', protect, authorize('student'), getMyApplications);

module.exports = router;
