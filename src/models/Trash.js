import { Schema, model } from "mongoose";

const trashSchema = new Schema(
  {
    itemType: {
      type: String,
      enum: ["PawnContract", "LiquidationContract", "PawnItem"],
      required: true,
    },
    itemId: { type: Schema.Types.ObjectId, required: true },
    data: { type: Schema.Types.Mixed },
    deletedAt: { type: Date, default: Date.now },
    daysRemaining: { type: Number, default: 7 },
  },
  { timestamps: true }
);

export const Trash = model("Trash", trashSchema);
