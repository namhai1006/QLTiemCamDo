import { PawnContract } from "../models/PawnContract.js";
import { PawnItem } from "../models/PawnItem.js";
import { InterestRate } from "../models/InterestRate.js";
import { Trash } from "../models/Trash.js";
import moment from "moment";
import mongoose from "mongoose";

export const getAllPawnContracts = async (req, res, next) => {
  try {
    const contracts = await PawnContract.find();
    res.status(200).json(contracts);
  } catch (error) {
    const err = new Error(error);
    err.status = 500;
    next(err);
  }
};

export const getPawnContractById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contract = await PawnContract.findById(id);
    if (!contract) {
      return res.status(404).json({ message: "Hợp đồng không tồn tại" });
    }
    res.status(200).json({ data: contract });
  } catch (error) {
    const err = new Error(error);
    err.status = 500;
    next(err);
  }
};

export const createPawnContract = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const interestRate = await InterestRate.findOne({ assetType: req.body.assetType });
    if (!interestRate) {
      throw new Error("Interest rate for the specified asset type not found.");
    }

    const startDate = moment(req.body.startDate || Date.now());
    const endDate = moment(req.body.endDate);
    const numberOfDays = endDate.diff(startDate, 'days');

    const principalAmount = req.body.principalAmount;
    const rate = interestRate.rate; // Daily interest rate as a decimal (e.g., 0.01 for 1%)
    const totalAmountDue = principalAmount + (principalAmount * rate * numberOfDays);
    const totalAmountCustomerNeedToPaid = totalAmountDue;

    const contract = new PawnContract({ ...req.body, creator: req.user.id, rate, totalAmountDue, totalAmountCustomerNeedToPaid });
    await contract.save({ session });

    await PawnItem.create(
      [{
        pawnContract: contract._id,
        assetType: contract.assetType,
        assetName: contract.assetName,
        assetCondition: contract.assetCondition,
        status: contract.status,
        creator: contract.creator,
      }],
      { session }
    );
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Hợp đồng đã được tạo thành công" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    const err = new Error(error);
    err.status = 500;
    next(err);
  }
};

export const updatePawnContract = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentAmount } = req.body;
    if (!paymentAmount) {
      return res
        .status(400)
        .json({ message: "Vui lòng kèm theo số tiền thanh toán" });
    }

    const contract = await PawnContract.findById(id);
    if (!contract) return res.status(404).json({ message: "Không tìm thấy hợp đồng" });

    if (contract.status === "liquidated") {
      return res.status(403).json({ message: "Hợp đồng đã thanh lý và không thể cập nhật." });
    }

    const updatedAmountToPay = contract.totalAmountCustomerNeedToPaid - paymentAmount;

    const updatePayload = {
      totalAmountCustomerNeedToPaid: updatedAmountToPay,
    };

    if (updatedAmountToPay <= 0) {
      updatePayload.status = "closed";
      await PawnItem.deleteMany({ pawnContract: id });
    }

    const updatedContract = await PawnContract.findByIdAndUpdate(id, updatePayload, { new: true });
    res.json({updatedContract, message: "Thanh toán thành công"});
  } catch (error) {
    const err = new Error(error);
    err.status = 500;
    next(err);
  }
};

export const deletePawnContract = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contract = await PawnContract.findById(id);
    if (!contract) {
      return res.status(404).json({ message: "Hợp đồng không tồn tại" });
    }
    await Trash.create({
      itemType: "PawnContract",
      itemId: contract._id,
      data: contract,
      deletedAt: new Date(),
      daysRemaining: 7,
    });

    await contract.remove();

    res.status(200).json({ message: "Hợp đồng đã chuyển vào thùng rác" });
  } catch (error) {
    const err = new Error(error);
    err.status = 500;
    next(err);
  }
}