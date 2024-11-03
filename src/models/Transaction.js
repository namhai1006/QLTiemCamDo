import { Schema, model } from 'mongoose';

const TransactionSchema = new Schema({
  contract: { type: Schema.Types.ObjectId, ref: 'Contract', required: true },
  date: { type: Date, default: Date.now },
  transactionType: { type: String, required: true }, // 'loan', 'interest payment', 'liquidation'
  employee: { type: String, required: true },
  customer: { type: String, required: true },
  amountReceived: { type: Number, required: true },
  amountPaid: Number
});

export const Transaction = model('Transaction', TransactionSchema);
