const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

// Route for registration (adds user to pending list)
router.post('/register', register);

// Route for login (checks if user is approved)
router.post('/login', login);

module.exports = router;
