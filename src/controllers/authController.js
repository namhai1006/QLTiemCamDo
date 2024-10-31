import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";

export async function register(req, res, next) {
  try {
    const { name, phone, address, username, email, password } = req.body;
    console.log("first");
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email hoặc Username đã tồn tại" });
    }

    const user = new User({ name, phone, address, username, email, password });
    await user.save();
    res
      .status(201)
      .json({ message: "Đăng ký thành công, chờ phê duyệt từ admin" });
  } catch (error) {
    const err = new Error(error);
    err.status = 500;
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { usernameOrEmail, password } = req.body;
    console.log(req.body)
    const foundUser = await User.findOne({
      $or: [{ email: usernameOrEmail }],
    });
    console.log(foundUser);

    if (!foundUser) {
      const err = new Error("Không tìm thấy người dùng");
      err.status = 404;
      next(err);
    }
    if (!foundUser.isApproved) {
      const err = new Error("Tài khoản của bạn chưa được phê duyệt");
      err.status = 403;
      next(err);
    }
    if (bcrypt.compareSync(password, foundUser.password)) {
      const accessToken = jwt.sign(
        { id: foundUser._id, role: foundUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      const { _id, name, phone, address, role } = foundUser;
      res
        .status(200)
        .json({ accessToken, user: { _id, name, phone, address, role } });
    } else {
      const err = new Error("Sai mật khẩu");
      err.status = 401;
      next(err);
    }
  } catch (error) {
    const err = new Error(error);
    err.status = 500;
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    res
      .status(200)
      .json({ message: "Đăng xuất thành công" });
  } catch (error) {
    const err = new Error(error);
    err.status = 500;
    next(err);
  }
}

