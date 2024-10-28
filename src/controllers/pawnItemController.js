import { PawnItem } from "../models/PawnItem.js";

export const getAllPawnItems = async (req, res, next) => {
    try {
        const items = await PawnItem.find();
        res.json(items);
    } catch (error) {
        const err = new Error(error);
        err.status = 500;
        next(err);
    }
}

export const createPawnItem = async (req, res, next) => {
    try {
        const item = new PawnItem({...req.body, creator: req.user.id});
        await item.save();
        res.status(201).json({ message: 'Vật này đã được tạo' });
    } catch (error) {
        const err = new Error(error);
        err.status = 500;
        next(err);
    }
}

export const getPawnItemsById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await PawnItem.findById(id);
      if (!item) {
        return res.status(404).json({ message: "Vật phẩm không tồn tại" });
      }
      res.status(200).json({ data: contract });
    } catch (error) {
      const err = new Error(error);
      err.status = 500;
      next(err);
    }
};

export const deletePawnItem = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const item = await PawnItem.findById(id);
      if (!item) {
        return res.status(404).json({ message: "Vật phẩm không tồn tại" });
      }
      await Trash.create({
        itemType: "PawnItem",
        itemId: item._id,
        data: item,
        deletedAt: new Date(),
        daysRemaining: 7,
      });
  
      await item.remove();
  
      res.status(200).json({ message: "Vật phẩm đã chuyển vào thùng rác" });
    } catch (error) {
      const err = new Error(error);
      err.status = 500;
      next(err);
    }
};