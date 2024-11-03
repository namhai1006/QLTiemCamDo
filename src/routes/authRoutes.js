import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const Router = express.Router();

// Register route
Router.post('/register', async (req, res, next) => {
  try {
    const { name, phone, address, username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email hoặc Username đã tồn tại" });
    }

    // Create a new user
    const user = new User({ name, phone, address, username, email, password });
    await user.save();

    // Redirect to login page
    res.redirect('/api/v1/auth/login');
  } catch (error) {
    console.error(error);
    next(new Error("Đã xảy ra lỗi khi đăng ký."));
  }
});

// Login route

Router.post('/login', async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;
    console.log(req.body);

    // Tìm người dùng bằng email hoặc tên người dùng
    const foundUser = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });
    console.log(foundUser);

    if (!foundUser) {
      const err = new Error("Không tìm thấy người dùng");
      err.status = 404;
      return next(err);
    }

    if (!foundUser.isApproved) {
      const err = new Error("Tài khoản của bạn chưa được phê duyệt");
      err.status = 403;
      return next(err);
    }

    // So sánh mật khẩu
    if (bcrypt.compareSync(password, foundUser.password)) {
      const accessToken = jwt.sign(
        { id: foundUser._id, role: foundUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Lưu thông tin người dùng vào session nếu bạn sử dụng session
      req.session.user = foundUser;
      req.session.token = accessToken;

      // Chuyển hướng đến dashboard
      return res.redirect('/dashboard');
    } else {
      const err = new Error("Sai mật khẩu");
      err.status = 401;
      return next(err);
    }
  } catch (error) {
    const err = new Error(error.message);
    err.status = 500;
    next(err);
  }
});

  

// Render registration page
Router.get('/register', (req, res) => {
  res.render('register');
});

// Render login page
Router.get('/login', (req, res) => {
  res.render('login');
});

export default Router;
