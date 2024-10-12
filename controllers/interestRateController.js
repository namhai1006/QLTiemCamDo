const InterestRate = require('../models/InterestRate');

// Get all interest rates
exports.getInterestRates = async (req, res) => {
  try {
    const rates = await InterestRate.find();
    res.json(rates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new interest rate
exports.createInterestRate = async (req, res) => {
  const { itemType, rate } = req.body;

  try {
    const interestRate = new InterestRate({ itemType, rate });
    await interestRate.save();
    res.status(201).json(interestRate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update interest rate
exports.updateInterestRate = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const interestRate = await InterestRate.findByIdAndUpdate(id, updates, { new: true });
    if (!interestRate) return res.status(404).json({ message: 'Interest rate not found' });
    res.json(interestRate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete interest rate
exports.deleteInterestRate = async (req, res) => {
  const { id } = req.params;

  try {
    const interestRate = await InterestRate.findByIdAndDelete(id);
    if (!interestRate) return res.status(404).json({ message: 'Interest rate not found' });
    res.json({ message: 'Interest rate deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
