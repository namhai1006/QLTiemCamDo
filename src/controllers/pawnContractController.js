import { PawnContract } from "../models/PawnContract.js";
import { PawnItem } from "../models/PawnItem.js";
import { Trash } from "../models/Trash.js";
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
    const contract = new PawnContract({ ...req.body, creator: req.user.id });
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
    const updatedContract = await PawnContract.findByIdAndUpdate(id, req.body, {
        new: true,
    });
    if (!updatedContract)
      return res.status(404).json({ message: "Không tìm thấy hợp đồng" });
    res.json(updatedContract);
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