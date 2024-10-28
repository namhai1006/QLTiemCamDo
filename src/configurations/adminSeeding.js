import { User } from "../models/User.js";
export const seedAdmin = async () => {
  try {
    const adminEmail = "admin";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const admin = new User({
        name: "Admin",
        email: adminEmail,
        username: "admin",
        password: "admin",
        phone: "0123456789",
        address: "Đà Nẵng",
        role: "admin",
        isApproved: true,
      });
      await admin.save();
      console.log("Khởi tạo tài khoản admin thành công!");
    } else {
      console.log("Tài khoản admin đã được tạo trước đó!");
    }
    console.log("Tài khoản ADMIN: ", {...existingAdmin._doc, password: "admin"});
  } catch (error) {
    console.log("Khởi tạo tài khoản admin thất bại!", error);
  }
};
