import express from "express";
import {
 createPawnContract,deletePawnContract,getAllPawnContracts,getPawnContractById,updatePawnContract
} from "../controllers/pawnContractController.js";
import { verifyAccessToken } from "../middlewares/verifyAccess.js";

const Router = express.Router();
Router.route("/get-all-pawn-contract").get(verifyAccessToken, getAllPawnContracts);
Router.route("/get-pawn-contract-by-id/:id").get(verifyAccessToken, getPawnContractById);
Router.route("/update-pawn-contract/:id").patch(verifyAccessToken, updatePawnContract);
Router.route("/delete-pawn-contract/:id").delete(verifyAccessToken, deletePawnContract);
Router.route("/create-pawn-contract").post(verifyAccessToken, createPawnContract);

export default Router;
