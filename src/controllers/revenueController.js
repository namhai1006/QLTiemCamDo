import Revenue from '../models/revenueModel.js';
import { PawnContract } from '../models/PawnContract.js';
import { LiquidationContract } from '../models/LiquidationContract.js';

export const calculateRevenue = async (req, res) => {
    try {
        const totalPawnContracts = await PawnContract.countDocuments();
        const totalLiquidationContracts = await LiquidationContract.countDocuments();
        const totalDisbursed = await PawnContract.aggregate([
            { $group: { _id: null, total: { $sum: "$principalAmount" } } },
        ]);
        const totalRevenue = await LiquidationContract.aggregate([
            { $group: { _id: null, total: { $sum: "$liquidationPrice" } } },
        ]);

        const totalDisbursedAmount = totalDisbursed[0]?.total || 0;
        const totalRevenueAmount = totalRevenue[0]?.total || 0;
        const profit = totalRevenueAmount - totalDisbursedAmount;

        const revenueData = new Revenue({
            totalPawnContracts,
            totalLiquidationContracts,
            totalDisbursed: totalDisbursedAmount,
            totalRevenue: totalRevenueAmount,
            profit,
        });

        await revenueData.save();

        res.status(200).json(revenueData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
