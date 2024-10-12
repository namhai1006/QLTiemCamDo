const mongoose = require('mongoose');

const liquidationSchema = new mongoose.Schema({
  customerName: String,
  employeeName: String,
  itemType: String,
  itemName: String,
  salePrice: Number,
  saleDate: Date
});

module.exports = mongoose.model('Liquidation', liquidationSchema);
