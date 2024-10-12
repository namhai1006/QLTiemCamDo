const Liquidation = require('../models/Liquidation');

// Get all liquidations
exports.getLiquidations = async (req, res) => {
  try {
    const liquidations = await Liquidation.find();
    res.json(liquidations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new liquidation
exports.createLiquidation = async (req, res) => {
  const { customerName, employeeName, itemType, itemName, salePrice, saleDate } = req.body;

  try {
    const liquidation = new Liquidation({ customerName, employeeName, itemType, itemName, salePrice, saleDate });
    await liquidation.save();
    res.status(201).json(liquidation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update liquidation
exports.updateLiquidation = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const liquidation = await Liquidation.findByIdAndUpdate(id, updates, { new: true });
    if (!liquidation) return res.status(404).json({ message: 'Liquidation not found' });
    res.json(liquidation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete liquidation
exports.deleteLiquidation = async (req, res) => {
  const { id } = req.params;

  try {
    const liquidation = await Liquidation.findByIdAndDelete(id);
    if (!liquidation) return res.status(404).json({ message: 'Liquidation not found' });
    res.json({ message: 'Liquidation deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
