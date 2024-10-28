import express from "express";
import {
  createLiquidationContract,
  deleteLiquidationContract,
  getAllLiquidationContracts,
  getLiquidationContractById,
} from "../controllers/liquidationContractController.js";
import { verifyAccessToken } from "../middlewares/verifyAccess.js";

const Router = express.Router();
Router.route("/get-all-liquidation-contract").get(
  verifyAccessToken,
  getAllLiquidationContracts
);
Router.route("/get-liquidation-contract-by-id/:id").get(
  verifyAccessToken,
  getLiquidationContractById
);
Router.route("/create-liquidation-contract").post(
  verifyAccessToken,
  createLiquidationContract
);
Router.route("/delete-liquidation-contract/:id").delete(
  verifyAccessToken,
  deleteLiquidationContract
);

export default Router;
