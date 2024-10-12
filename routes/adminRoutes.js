const express = require('express');
const { approveUser, rejectUser, getPendingUsers } = require('../controllers/adminController');
const router = express.Router();

// Route for approving pending user
router.put('/approve/:id', approveUser);

// Route for rejecting pending user
router.delete('/reject/:id', rejectUser);

// Route for getting pending users
router.get('/pending', getPendingUsers);

module.exports = router;
