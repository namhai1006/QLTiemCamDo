import express from "express";
import {
    createTransaction,
    getAllTransactions
} from "../controllers/transactionController.js";
import { verifyAccessToken } from "../middlewares/verifyAccess.js";

const Router = express.Router();
Router.route("/get-all-transaction").get(verifyAccessToken,        getAllTransactions);
Router.route("/create-transaction").post(verifyAccessToken,        createTransaction);

export default Router;
