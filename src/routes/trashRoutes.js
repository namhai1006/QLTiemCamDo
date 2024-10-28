import express from "express";
import {
  deleteFromTrash,
  getTrash,
  restoreFromTrash,
} from "../controllers/trashController.js";
import { verifyAccessToken } from "../middlewares/verifyAccess.js";

const Router = express.Router();
Router.route("/get-all-trash").get(verifyAccessToken, getTrash);
Router.route("/restore-from-trash/:id").patch(verifyAccessToken, restoreFromTrash);
Router.route("/delete-from-trash/:id").delete(verifyAccessToken, deleteFromTrash);

export default Router;
