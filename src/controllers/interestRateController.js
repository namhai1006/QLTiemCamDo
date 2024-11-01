import { InterestRate } from "../models/InterestRate.js";

export const getInterestRate = async (req, res, next) => {
  try {
    const foundUser = req.user;

    if (!foundUser?.role == "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const rates = await InterestRate.find();
    res.json(rates);
  } catch (error) {
    const err = new Error(error);
    err.status = 500;
    next(err);
  }
};

export const createInterestRate = async (req, res, next) => {
  try {
    const foundUser = req.user;
    if (!foundUser?.role == "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { assetType, rate } = req.body;
    const newInterestRate = new InterestRate({ assetType, rate });
    await newInterestRate.save();
    res.status(201).json(newInterestRate);
  } catch (error) {
    const err = new Error(error);
    err.status = 500;
    next(err);
  }
};

export const updateInterestRate = async (req, res, next) => {
  try {
    const foundUser = req.user;
    if (!foundUser?.role == "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.params;
    const updates = req.body;
    const interestRate = await InterestRate.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!interestRate) {
      return res.status(404).json({ message: "Interest rate not found" });
    }
    res.json(interestRate);
  } catch (error) {
    const err = new Error(error);
    err.status = 500;
    next(err);
  }
};

export const deleteInterestRate = async (req, res, next) => {
  try {
    const foundUser = req.user;
    if (!foundUser?.role == "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.params;
    const interestRate = await InterestRate.findByIdAndDelete(id);
    if (!interestRate) {
      return res.status(404).json({ message: "Interest rate not found" });
    }
    res.status(200).json({ interestRate, message: "Interest rate has been deleted successfully!" });
  } catch (error) {
    const err = new Error(error);
    err.status = 500;
    next(err);
  }
};
