import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
export const verifyAccessToken = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res
      .status(401)
      .json({ message: "Không tìm thấy định danh người dùng" });
  }
  const accessToken = authorization.split(" ")[1];
  const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
  if (!payload) {
    return res
      .status(401)
      .json({ message: "Không tìm thấy định danh người dùng" });
  }
  const foundUser = await User.findById(payload.id);
  if (!foundUser) {
    return res
      .status(401)
      .json({ message: "Không tìm thấy định danh người dùng" });
  }
  req.user = foundUser;
  next();
};
