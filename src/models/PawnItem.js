import { Schema, model } from "mongoose";

const pawnItemSchema = new Schema(
  {
    // Tự động lấy từ hợp đồng cầm đồ liên quan
    pawnContract: {
      type: Schema.Types.ObjectId,
      ref: "PawnContract",
    },
    assetType: { type: String, required: true }, // Loại tài sản
    assetName: { type: String, required: true }, // Tên tài sản
    assetCondition: { type: String, required: true }, // Đặc điểm/trạng thái của tài sản
    status: {
      type: String,
      enum: ["active", "near_due", "overdue", "liquidated"],
      default: "liquidated",
    },
    // Thông tin hệ thống
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
  },
  { timestamps: true }
);

export const PawnItem = model("PawnItem", pawnItemSchema);