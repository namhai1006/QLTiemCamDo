import express from "express";
import _ from "lodash";
import { verifyAccessToken } from "../middlewares/verifyAccess.js";
import { User } from "../models/User.js";

const Router = express.Router();

// Get all users
Router.route("/get-all-user").get(verifyAccessToken, async (req, res, next) => {
  try {
    const foundUser = req.user;

    if (foundUser?.role !== "admin") {
      return res.status(401).json({ message: "Bạn không có quyền truy cập" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let search = req.query.search ?? "";
    search = search.replace(/^"|"$/g, "");
    let filter = { username: { $ne: "admin" } };

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { username: searchRegex },
        { name: searchRegex },
        { email: searchRegex },
        { address: searchRegex },
      ];
    }

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const totalUsers = await User.countDocuments(filter);

    // Check if the request expects a JSON response or HTML render
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.status(200).json({
        pageSize: users.length,
        total: totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        users: users.map((user) => _.omit(user.toObject(), ["password"])),
      });
    } else {
      // Default to rendering the view
      res.status(200).render("user/listuser", {
        pageSize: users.length,
        total: totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        users: users.map((user) => _.omit(user.toObject(), ["password"])),
      });
    }
  } catch (error) {
    next(new Error("Lỗi khi tải danh sách người dùng"));
  }
});


// Get all pending users
Router.route("/get-all-pending-user").get(verifyAccessToken, async (req, res, next) => {
  try {
    const foundUser = req.user;

    if (foundUser?.role !== "admin") {
      return res.status(401).json({ message: "Bạn không có quyền truy cập" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let search = req.query.search ?? "";
    search = search.replace(/^"|"$/g, "");
    let filter = { username: { $ne: "admin" }, isApproved: false };

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { username: searchRegex },
        { name: searchRegex },
        { email: searchRegex },
        { address: searchRegex },
      ];
    }

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const totalUsers = await User.countDocuments(filter);

    // Check if the request expects a JSON response or HTML render
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.status(200).json({
        pageSize: users.length,
        total: totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        users: users.map((user) => _.omit(user.toObject(), ["password"])),
      });
    } else {
      // Default to rendering the view
      res.status(200).render("user/pendinguser", {
        pageSize: users.length,
        total: totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        users: users.map((user) => _.omit(user.toObject(), ["password"])),
      });
    }
  } catch (error) {
    next(new Error("Lỗi khi tải danh sách người dùng chờ duyệt"));
  }
});


export default Router;
