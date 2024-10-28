import {Transaction} from "../models/Transaction.js";
export const getAllTransactions = async (req, res, next) => {
    try {
        const foundUser = req.user;
        if (!foundUser?.role == "admin") {
          return res.status(401).json({ message: "Unauthorized" });
        }
        const transactions = await Transaction.find().populate('user', 'name');
        res.json(transactions);
    } catch (error) {
        const err = new Error(error);
        err.status = 500;
        next(err);
    }
}

export const createTransaction = async (req, res, next) => {
    try {
        const foundUser = req.user;
        if (!foundUser?.role == "admin") {
          return res.status(401).json({ message: "Unauthorized" });
        }
        const transaction = new Transaction({ ...req.body, creator: req.user.id });
        await transaction.save();
        res.status(201).json({ message: 'Giao dịch đã được tạo' });
    } catch (error) {
        const err = new Error(error);
        err.status = 500;
        next(err);
    }
}