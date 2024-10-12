const mongoose = require('mongoose');

const pawnContractSchema = new mongoose.Schema({
  customerName: String,
  idCard: String,
  itemType: String,
  itemName: String,
  characteristic: String,
  loanAmount: Number,
  loanDate: Date,
  dueDate: Date,
  interestRate: Number,
  totalAmount: Number, // Tổng tiền phải trả (gốc + lãi)
  status: { type: String, enum: ['active', 'approaching', 'expired'], default: 'active' }
});

module.exports = mongoose.model('PawnContract', pawnContractSchema);
