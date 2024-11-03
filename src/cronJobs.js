import cron from "node-cron";
import { PawnContract } from "./models/PawnContract.js";
import mongoose from "mongoose";
import moment from "moment";

cron.schedule("0 * * * *", async () => {
  console.log("Cron job started at:", new Date());
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const today = moment.utc().startOf('day');
    console.log("Today (UTC):", today.format());

    // Cập nhật trạng thái 'near_due' cho các hợp đồng sẽ hết hạn trong 3 ngày tới
    const nearDueDate = today.clone().add(3, 'days');
    const resultNearDue = await PawnContract.updateMany(
      { status: "active", endDate: { $lte: nearDueDate, $gt: today } },
      { $set: { status: "near_due" } }
    );
    console.log("Number of contracts updated to near_due:", resultNearDue.modifiedCount);

    // Cập nhật trạng thái 'overdue' cho các hợp đồng có `endDate` là hôm nay
    const resultOverdue = await PawnContract.updateMany(
      { status: { $in: ["active", "near_due"] }, endDate: today },
      { $set: { status: "overdue" } }
    );
    console.log("Number of contracts updated to overdue:", resultOverdue.modifiedCount);

    // Cập nhật trạng thái 'liquidated' cho các hợp đồng quá hạn
    const resultLiquidated = await PawnContract.updateMany(
      { status: "overdue", endDate: { $lt: today } },
      { $set: { status: "liquidated" } }
    );
    console.log("Number of contracts updated to liquidated:", resultLiquidated.modifiedCount);

    console.log("Contract statuses updated based on endDate.");
  } catch (error) {
    console.error("Error updating contract statuses:", error);
  }
});

