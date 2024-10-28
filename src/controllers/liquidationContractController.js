import { PawnContract } from "../models/PawnContract.js";
import { LiquidationContract } from "../models/LiquidationContract.js";
import { PawnItem } from "../models/PawnItem.js";
import { Trash } from "../models/Trash.js";

export const createLiquidationContract = async (req, res) => {
  try {
    const {pawnContractId} = req.params;
    const {
      customerName,
      phoneNumber,
      address,
      liquidationPrice,
    } = req.body;

    const pawnContract = await PawnContract.findById(pawnContractId);
    if (!pawnContract) {
      return res.status(404).json({ message: "Hợp đồng cầm đồ không tồn tại" });
    }

    const newLiquidationContract = new LiquidationContract({
      customerName,
      phoneNumber,
      address,
      liquidationPrice,
      pawnContract: pawnContract._id,
      assetType: pawnContract.assetType,
      assetName: pawnContract.assetName,
      assetCondition: pawnContract.assetCondition,
      creator: req.user._id,
    });

    await newLiquidationContract.save();

    await PawnContract.findByIdAndUpdate(pawnContractId, { status: 'closed' });
    await PawnItem.findOneAndDelete({ pawnContract: pawnContractId });

    res
      .status(201)
      .json({ message: "Thanh lý thành công", data: newLiquidationContract });
  } catch (error) {
    const err = new Error(error);
    err.status = 500;
    next(err);
  }
};

export const getAllLiquidationContracts = async (req, res, next) => {
  try {
    const liquidationContracts = await LiquidationContract.find();
    res.json(liquidationContracts);
  } catch (error) {
    const err = new Error(error);
    err.status = 500;
    next(err);
  }
};

export const getLiquidationContractById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contract = await LiquidationContract.findById(id);
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

export const deleteLiquidationContract = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contract = await LiquidationContract.findById(id);
    if (!contract) {
      return res.status(404).json({ message: "Hợp đồng không tồn tại" });
    }
    await Trash.create({
      itemType: "LiquidationContract",
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
};
