import express from "express";
import {
  getAllPendingUser,
  getAllUsers,
  updateProfile,
  changePassword,
} from "../controllers/userController.js";
import { verifyAccessToken } from "../middlewares/verifyAccess.js";

const Router = express.Router();
Router.route("/get-all-user").get(verifyAccessToken, getAllUsers);
Router.route("/get-all-pending-user").get(verifyAccessToken, getAllPendingUser);
Router.route("/update-profile").put(verifyAccessToken, updateProfile);
Router.route("/change-password").put(verifyAccessToken, changePassword);

export default Router;
