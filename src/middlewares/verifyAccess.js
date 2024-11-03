import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const verifyAccessToken = async (req, res, next) => {
  const token = req.session.token; // Lấy token từ session

  if (!token) {
    return res.status(401).json({ message: "Không tìm thấy định danh người dùng" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    const foundUser = await User.findById(payload.id);

    if (!foundUser) {
      return res.status(401).json({ message: "Không tìm thấy định danh người dùng" });
    } 

    req.user = {
      id: foundUser._id,
      role: foundUser.role,
      name: foundUser.name, // Ensure these fields exist in your User model
      email: foundUser.email, // Lưu vai trò của người dùng
      createdAt: foundUser.createdAt, // Ngày tạo tài khoản
      updatedAt: foundUser.updatedAt, // Ngày cập nhật cuối
      // bạn có thể thêm các thông tin khác nếu cần
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};