import express from 'express';
import { verifyAccessToken } from "../middlewares/verifyAccess.js";
import { User } from "../models/User.js";

const Router = express.Router();
Router.patch('/approve-user/:id', verifyAccessToken, async (req, res, next) => {
  try {
    const foundUser = req.user;
    if (foundUser?.role !== "admin") {
      return res.status(401).json({ message: "Bạn không có quyền truy cập" });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Vui lòng kèm theo điều kiện tìm kiếm" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    user.isApproved = true;
    await user.save();
    res.render('admin/adminapprove');
  } catch (error) {
    next(new Error("Đã xảy ra lỗi: " + error.message));
  }
});

Router.patch('/reject-user/:id', verifyAccessToken, async (req, res, next) => {
  try {
    const foundUser = req.user;
    if (foundUser?.role !== "admin") {
      return res.status(401).json({ message: "Bạn không có quyền truy cập" });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Vui lòng kèm theo điều kiện tìm kiếm" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    user.isApproved = false;
    await user.save();
    res.render('admin/adminreject');
  } catch (error) {
    next(new Error("Đã xảy ra lỗi: " + error.message));
  }
});

Router.delete('/delete-pending-user/:id', verifyAccessToken, async (req, res, next) => {
  try {
    const foundUser = req.user;
    if (foundUser?.role !== "admin") {
      return res.status(401).json({ message: "Bạn không có quyền truy cập" });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Vui lòng kèm theo điệu kiện tìm kiệm" });
    }

    const isUserPending = await User.findOne({ _id: id, isApproved: false });
    if (!isUserPending) {
      return res.status(404).json({
        message: "Không thể thực hiện xóa người dùng do điều kiện không phù hợp",
      });
    }

    await User.deleteOne({ _id: id });
    res.render('admin/adminapendingdelete');
  } catch (error) {
    next(new Error("Đã xảy ra lỗi: " + error.message));
  }
});

// Get routes for rendering views (if necessary)
Router.get('/approve-user/:id', (req, res) => {
  res.render('admin/adminapprove');
});

Router.get('/reject-user/:id', (req, res) => {
  res.render('admin/adminreject');
});

Router.get('/delete-pending-user/:id', (req, res) => {
  res.render('admin/adminapendingdelete');
});

export default Router;
