import express from "express";
import {
  getAllPendingUser,
  getAllUsers,
} from "../controllers/userController.js";
import { verifyAccessToken } from "../middlewares/verifyAccess.js";

const Router = express.Router();
Router.route("/get-all-user").get(verifyAccessToken, getAllUsers);
Router.route("/get-all-pending-user").get(verifyAccessToken, getAllPendingUser);

export default Router;
