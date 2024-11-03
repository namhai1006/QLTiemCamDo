import { Schema, model } from "mongoose";
import { PawnItem } from "../models/PawnItem.js";

const pawnContractSchema = new Schema(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, required: true },
    assetType: { type: String, required: true },
    assetName: { type: String, required: true },
    assetCondition: { type: String, required: true },
    principalAmount: { type: Number, required: true },
    rate: { type: Number, required: true }, // %/day
    startDate: { type: Date, default: Date.now, required: true },
    endDate: { type: Date, required: true },
    totalAmountDue: { type: Number, required: true },
    totalAmountCustomerNeedToPaid: { type: Number, required: true },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "near_due", "overdue", "liquidated", "closed"],
      default: "active",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Pre-save middleware to update PawnItem status when PawnContract status changes
pawnContractSchema.pre("save", async function (next) {
  if (!this.isModified("status")) return next();

  try {
    await PawnItem.updateMany(
      { pawnContract: this._id },
      { $set: { status: this.status } }
    );
    next();
  } catch (error) {
    next(error);
  }
});

export const PawnContract = model("PawnContract", pawnContractSchema);
