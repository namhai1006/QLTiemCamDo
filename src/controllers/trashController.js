import { Trash } from "../models/Trash.js";

export const getTrash = async (req, res, next) => {
    try {
        const foundUser = req.user;
        if (!foundUser?.role == "admin") {
            return res.status(401).json({ message: "Bạn không có quyền truy cập" });
        }
        const trashItems = await Trash.find();
        res.json(trashItems);
    } catch (error) {
        const err = new Error(error);
        err.status = 500;
        next(err);
    }
}

export const restoreFromTrash = async (req, res, next) => {
    try {
        const foundUser = req.user;
        if (!foundUser?.role == "admin") {
            return res.status(401).json({ message: "Bạn không có quyền truy cập" });
        }
        const { id } = req.params;
        const trashItem = await Trash.findById(id);

        if (!trashItem) {
            return res.status(404).json({ message: 'Không tìm thấy mục cần khôi phục' });
        }

        const { type, data } = trashItem;

        // Dynamically import the model using ES6 import
        const { default: Model } = await import(`../models/${type}.js`);

        // Tạo lại dữ liệu từ thùng rác
        const restoredItem = new Model(data);
        await restoredItem.save();
        await Trash.findByIdAndDelete(id);

        res.status(200).json({ message: 'Khôi phục thành công', restoredItem });
    } catch (error) {
        const err = new Error(error);
        err.status = 500;
        next(err);
    }
};

export const deleteFromTrash = async (req, res, next) => {
    try {
        const foundUser = req.user;
        if (!foundUser?.role == "admin") {
            return res.status(401).json({ message: "Bạn không có quyền truy cập" });
        }
        const { id } = req.params;
        const trashItem = await Trash.findByIdAndDelete(id);

        if (!trashItem) {
            return res.status(404).json({ message: 'Không tìm thấy mục cần xóa' });
        }

        res.status(200).json({ message: 'Xóa vĩnh viễn thành công' });
    } catch (error) {
        const err = new Error(error);
        err.status = 500;
        next(err);
    }
}