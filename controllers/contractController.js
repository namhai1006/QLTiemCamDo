const PawnContract = require('../models/PawnContract');

// Get all pawn contracts
exports.getPawnContracts = async (req, res) => {
  try {
    const contracts = await PawnContract.find();
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new pawn contract
exports.createPawnContract = async (req, res) => {
  const { customerName, idCard, itemName, loanAmount, loanDate, interestRate, totalAmount } = req.body;

  try {
    const contract = new PawnContract({ customerName, idCard, itemName, loanAmount, loanDate, interestRate, totalAmount });
    await contract.save();
    res.status(201).json(contract);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update pawn contract
exports.updatePawnContract = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const contract = await PawnContract.findByIdAndUpdate(id, updates, { new: true });
    if (!contract) return res.status(404).json({ message: 'Contract not found' });
    res.json(contract);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete pawn contract
exports.deletePawnContract = async (req, res) => {
  const { id } = req.params;

  try {
    const contract = await PawnContract.findByIdAndDelete(id);
    if (!contract) return res.status(404).json({ message: 'Contract not found' });
    res.json({ message: 'Contract deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
