import express from "express";
import {
  createPawnItem,
  getAllPawnItems,
  getPawnItemsById,
  deletePawnItem
} from "../controllers/pawnItemController.js";
import { verifyAccessToken } from "../middlewares/verifyAccess.js";

const Router = express.Router();
Router.route("/get-all-pawn-item").get(verifyAccessToken, getAllPawnItems);
Router.route("/create-pawn-item").post(verifyAccessToken, createPawnItem);
Router.route("/get-pawn-item-by-id/:id").post(verifyAccessToken, getPawnItemsById);
Router.route("/delete-pawn-item").post(verifyAccessToken, deletePawnItem);

export default Router;
