import _ from "lodash";
import { User } from "../models/User.js";
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
