const express = require('express');
const { getLiquidations, createLiquidation, updateLiquidation, deleteLiquidation } = require('../controllers/liquidationController');
const router = express.Router();

router.get('/', getLiquidations);
router.post('/', createLiquidation);
router.put('/:id', updateLiquidation);
router.delete('/:id', deleteLiquidation);

module.exports = router;
