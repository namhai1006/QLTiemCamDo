import express from 'express';
import { approveUser, deletePedingUser, rejectUser} from '../controllers/adminController.js';
import { verifyAccessToken } from "../middlewares/verifyAccess.js";

const Router = express.Router();
Router.route('/approve-user/:id').patch(verifyAccessToken, approveUser);
Router.route('/reject-user/:id').patch(verifyAccessToken, rejectUser);
Router.route('/delete-pending-user/:id').delete(verifyAccessToken,deletePedingUser);

export default Router;
