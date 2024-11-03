import express from "express";
import { verifyAccessToken } from "../middlewares/verifyAccess.js";
import { InterestRate } from "../models/InterestRate.js";

const Router = express.Router();

// Get interest rates
Router.get("/get-interest-rate", verifyAccessToken, async (req, res, next) => {
  try {
    const foundUser = req.user;
    if (foundUser?.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const rates = await InterestRate.find();
    const role = req.user.role; // Assuming req.user contains the user data with role
        const name = req.user.name;
        const email = req.user.email;
    res.render("interestRate/listinterest", { rates, role, name, email });
  } catch (error) {
    next(new Error(error));
  }
});

// Create a new interest rate
Router.route("/create-interest-rate")
  .post(verifyAccessToken, async (req, res, next) => {
    try {
      const foundUser = req.user;
      if (foundUser?.role !== "admin") {
        return res.status(403).json({ message: "Bạn không có quyền truy cập" });
      }

      const { assetType, rate } = req.body;
      const newInterestRate = new InterestRate({ assetType, rate });
      await newInterestRate.save();
      res.redirect("/api/v1/InterestRate/get-interest-rate");
    } catch (error) {
      next(new Error(error));
    }
  })
  .get((req, res) => {
    res.render("interestRate/createInterest");
  });

// Update an interest rate
Router.route("/update-interest-rate/:id")
  .patch(verifyAccessToken, async (req, res, next) => {
    try {
      const foundUser = req.user;
      if (foundUser?.role !== "admin") {
        return res.status(403).json({ message: "Bạn không có quyền truy cập" });
      }

      const { id } = req.params;
      const updates = req.body;
      const rate = await InterestRate.findByIdAndUpdate(id, updates, { new: true });
      if (!rate) {
        return res.status(404).json({ message: "Interest rate not found" });
      }
      res.render("interestRate/updateInterest", { rate });
    } catch (error) {
      next(new Error(error));
    }
  })
  .get(async (req, res, next) => {
    try {
      const { id } = req.params;
      const rate = await InterestRate.findById(id);
      if (!rate) {
        return res.status(404).json({ message: "Lãi suất không tồn tại" });
      }
      res.render("interestRate/updateInterest", { rate });
    } catch (error) {
      next(new Error(error));
    }
  });

// Delete an interest rate
Router.route("/delete-interest-rate/:id")
  .delete(verifyAccessToken, async (req, res, next) => {
    try {
      const foundUser = req.user;
      if (foundUser?.role !== "admin") {
        return res.status(403).json({ message: "Bạn không có quyền truy cập" });
      }

      const { id } = req.params;
      const rate = await InterestRate.findByIdAndDelete(id);
      if (!rate) {
        return res.status(404).json({ message: "Interest rate not found" });
      }
      res.render("interestRate/deleteInterest");
    } catch (error) {
      next(new Error(error));
    }
  })
  .get(async (req, res, next) => {
    try {
      const { id } = req.params;
      const response = await fetch(`/api/v1/interestRate/delete-interest-rate/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  });

export default Router;
