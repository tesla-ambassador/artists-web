const express = require('express');
const { bookEvent } = require('../controllers/bookingController');
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();



router.use(validateToken);
router.post('/', protect, bookEvent);

module.exports = router;
