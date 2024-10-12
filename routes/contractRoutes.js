const express = require('express');
const { getPawnContracts, createPawnContract, updatePawnContract, deletePawnContract } = require('../controllers/contractController');
const router = express.Router();

router.get('/', getPawnContracts);
router.post('/', createPawnContract);
router.put('/:id', updatePawnContract);
router.delete('/:id', deletePawnContract);

module.exports = router;
