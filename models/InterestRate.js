const mongoose = require('mongoose');

const interestRateSchema = new mongoose.Schema({
  itemType: String,
  rate: Number 
});

module.exports = mongoose.model('InterestRate', interestRateSchema);
