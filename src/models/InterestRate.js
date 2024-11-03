import { Schema, model } from "mongoose";

const interestRateSchema = new Schema(
  {
    assetType: { type: String, required: true, unique: true },
    rate: { type: Number, required: true }, // Đơn vị: %/ngày
  },
  { timestamps: true }
);

export const InterestRate = model("InterestRate", interestRateSchema);

