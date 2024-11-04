import mongoose from "mongoose";

const RevenueSchema = new mongoose.Schema({
    totalPawnContracts: { type: Number, default: 0 },
    totalLiquidationContracts: { type: Number, default: 0 },
    totalDisbursed: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
});

const Revenue = mongoose.model('Revenue', RevenueSchema);

export default Revenue;
