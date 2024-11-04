import _ from "lodash";
import { User } from "../models/User.js";
import { hash, compare, genSalt } from "bcrypt";

export const getAllUsers = async (req, res, next) => {
  try {
    const foundUser = req.user;

    if (!foundUser?.role == "admin") {
      return res.status(401).json({ message: "Bạn không có quyền truy cập" });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let search = req.query.search ?? "";
    search = search.replace(/^"|"$/g, "");

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { username: searchRegex },
        { name: searchRegex },
        { email: searchRegex },
        { address: searchRegex },
      ];
    }
    let filter = { username: { $ne: "admin" } };
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const totalUsers = await User.countDocuments(filter);

    res.status(200).json({
      pageSize: users.length,
      total: totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      users: users.map((user) => {
        const res = _.omit(user.toObject(), ["password"]);
        return res;
      }),
    });
  } catch (error) {
    const err = new Error(error);
    err.status = 500;
    next(err);
  }
};

export const getAllPendingUser = async (req, res, next) => {
  try {
    const foundUser = req.user;

    if (!foundUser?.role == "admin") {
      return res.status(401).json({ message: "Bạn không có quyền truy cập" });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let search = req.query.search ?? "";
    search = search.replace(/^"|"$/g, "");

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { username: searchRegex },
        { name: searchRegex },
        { email: searchRegex },
        { address: searchRegex },
      ];
    }
    let filter = { username: { $ne: "admin" }, isApproved: false };
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const totalUsers = await User.countDocuments(filter);

    res.status(200).json({
      pageSize: users.length,
      total: totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      users: users.map((user) => {
        const res = _.omit(user.toObject(), ["password"]);
        return res;
      }),
    });
  } catch (error) {
    const err = new Error(error);
    err.status = 500;
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const userId = req.user._id;
    if (!userId) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone, address },
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Cập nhật thông tin cá nhân thành công", user: updatedUser });
  } catch (error) {
    next(new Error("Cập nhật thông tin cá nhân thất bại"));
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const isMatch = await compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
    }

    const salt = await genSalt(10);
    user.password = await hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    next(new Error("Đổi mật khẩu thất bại"));
  }
};