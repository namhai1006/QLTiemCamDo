import express from "express";
import { welcome } from "../controllers/welcomeController.js";
const Router = express.Router();
Router.route('/welcome').get(welcome);
export default Router