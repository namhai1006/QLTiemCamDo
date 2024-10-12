const express = require('express');
const { getInterestRates, createInterestRate, updateInterestRate, deleteInterestRate } = require('../controllers/interestRateController');
const router = express.Router();

router.get('/', getInterestRates);
router.post('/', createInterestRate);
router.put('/:id', updateInterestRate);
router.delete('/:id', deleteInterestRate);

module.exports = router;
