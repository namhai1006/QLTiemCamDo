import express from "express";
import { verifyAccessToken } from "../middlewares/verifyAccess.js";
import { PawnContract } from "../models/PawnContract.js";
import { Trash } from "../models/Trash.js";
const Router = express.Router();

// Get all trash items
Router.get("/get-all-trash", verifyAccessToken, async (req, res, next) => {
  try {
    const foundUser = req.user;
    if (foundUser?.role !== "admin") {
      return res.status(401).json({ message: "Bạn không có quyền truy cập" });
    }

    const trashItems = await Trash.find();
    res.render('trash/trashitem', { trashItems });
  } catch (error) {
    next(new Error(error));
  }
});




Router.patch("/restore-from-trash/:id", verifyAccessToken, async (req, res, next) => {
  try {
    const foundUser = req.user;
    if (foundUser?.role !== "admin") {
      return res.status(401).json({ message: "Bạn không có quyền truy cập" });
    }

    const { id } = req.params;
    const trashItem = await Trash.findById(id);
    if (!trashItem) {
      return res.status(404).json({ message: 'Không tìm thấy mục cần khôi phục' });
    }

    const { itemType, data } = trashItem;
    const validModels = ["PawnContract", "LiquidationContract", "PawnItem"];
    if (!validModels.includes(itemType)) {
      return res.status(400).json({ message: `Invalid model type: ${itemType}` });
    }

    // Sử dụng mô hình đã import
    let Model;
    switch (itemType) {
      case "PawnContract":
        Model = PawnContract;
        break;
      case "LiquidationContract":
        Model = (await import('../models/LiquidationContract.js')).LiquidationContract;
        break;
      case "PawnItem":
        Model = (await import('../models/PawnItem.js')).PawnItem;
        break;
      default:
        return res.status(400).json({ message: `Invalid model type: ${itemType}` });
    }

    // Kiểm tra xem itemType có phải là 'PawnContract' không
    if (itemType === "PawnContract") {
      console.log("Data from trash item:", data); // In ra thông tin data

      // Kiểm tra xem dữ liệu đã có totalAmountCustomerNeedToPaid chưa
      if (data.totalAmountCustomerNeedToPaid == null) {
        console.log("totalAmountCustomerNeedToPaid là thiếu trong data!"); // Thông báo khi thiếu tổng tiền
        return res.status(400).json({ message: 'Không tìm thấy thông tin tổng tiền cần thanh toán cho hợp đồng cầm cố' });
      }

      // Cập nhật giá trị tổng tiền cần thanh toán
      // Ở đây bạn có thể làm thêm các thao tác cần thiết với data nếu cần
    }

    // Tạo đối tượng mới từ dữ liệu và lưu vào cơ sở dữ liệu
    const restoredItem = new Model(data);
    await restoredItem.save();
    await Trash.findByIdAndDelete(id);
    res.redirect('/api/v1/trash/get-all-trash');
  } catch (error) {
    next(new Error(error));
  }
});

// Render restore trash page
Router.get("/restore-from-trash/:id", (req, res) => {
  res.render('trash/restoretrash');
});

// Delete an item from trash
Router.delete("/delete-from-trash/:id", verifyAccessToken, async (req, res, next) => {
  try {
    const foundUser = req.user;
    if (foundUser?.role !== "admin") {
      return res.status(401).json({ message: "Bạn không có quyền truy cập" });
    }

    const { id } = req.params;
    const trashItem = await Trash.findByIdAndDelete(id);
    if (!trashItem) {
      return res.status(404).json({ message: 'Không tìm thấy mục cần xóa' });
    }

    res.redirect('/api/v1/trash/get-all-trash');
  } catch (error) {
    next(new Error(error));
  }
});

export default Router;
