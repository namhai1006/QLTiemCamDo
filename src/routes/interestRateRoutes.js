import express from "express";
import {
  createInterestRate,
  deleteInterestRate,
  getInterestRate,
  updateInterestRate,
} from "../controllers/interestRateController.js";
import { verifyAccessToken } from "../middlewares/verifyAccess.js";

const Router = express.Router();
Router.route("/get-interest-rate").get(verifyAccessToken, getInterestRate);
Router.route("/create-interest-rate").post(
  verifyAccessToken,
  createInterestRate
);
Router.route("/update-interest-rate").patch(
  verifyAccessToken,
  updateInterestRate
);
Router.route("/delete-interest-rate").delete(
  verifyAccessToken,
  deleteInterestRate
);

export default Router;
