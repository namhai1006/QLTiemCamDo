import { User } from "../models/User.js";

export const approveUser = async (req, res, next) => {
  try {
    const foundUser = req.User;
    if (!foundUser?.role == "admin") {
      return res.status(401).json({ message: "Bạn không có quyền truy cập" });
    }
    const { id } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ message: "Vui lòng kèm theo điều kiện tìm kiếm" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    user.isApproved = true;
    user.save();
    return res
      .status(200)
      .json({ message: "Đã phê duyệt người dùng thành công!" });
  } catch (error) {
    const err = new Error(error);
    err.status = 500;
    next(err);
  }
};

export const rejectUser = async (req, res, next) => {
  try {
    const foundUser = req.User;
    if (!foundUser?.role == "admin") {
      return res.status(401).json({ message: "Bạn không có quyền truy cập" });
    }
    const { id } = req.body;
    console.log(id);
    if (!id) {
      return res
        .status(400)
        .json({ message: "Vui lòng kèm theo điều kiện tìm kiếm" });
    }
    const user = await User.findById(id);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    user.isApproved = false;
    user.save();
    return res.status(200).json({ message: "Đã từ chối người dùng" });
  } catch (error) {
    const err = new Error(error);
    err.status = 500;
    next(err);
  }
};

export const deletePedingUser = async (req, res, next) => {
  try {
    const foundUser = req.User;
    if (!foundUser?.role == "admin") {
      return res.status(401).json({ message: "Bạn không có quyền truy cập" });
    }
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ message: "Vui lòng kèm theo điều kiện tìm kiếm" });
    }
    const isUserPending = await User.findOne({ _id: id, isApproved: false });
    if (!isUserPending) {
      return res.status(404).json({
        message:
          "Không thể thực hiện xóa người dùng người dùng do điều kiện không phù hợp",
      });
    }
    await User.deleteOne({ _id: id });
    return res
      .status(200)
      .json({ message: "Đã xóa người dùng đang yêu cầu duyệt" });
  } catch (error) {
    const err = new Error(error);
    err.status = 500;
    next(err);
  }
};
