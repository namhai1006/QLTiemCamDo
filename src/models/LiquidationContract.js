import { Schema, model } from "mongoose";

const liquidationContractSchema = new Schema(
  {
    customerName: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    address: { type: String, required: true },
    liquidationPrice: { type: Number, required: true },
    pawnContract: {
      type: Schema.Types.ObjectId,
      ref: "PawnContract",
      required: true,
    },
    assetType: { type: String, required: true },
    assetName: { type: String, required: true },
    assetCondition: { type: String, required: true },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const LiquidationContract = model("LiquidationContract",   liquidationContractSchema);