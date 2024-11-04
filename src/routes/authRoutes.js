import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { verifyEmail } from '../middlewares/verifyEmail.js';

const Router = express.Router();
Router.route('/register').post( register );
Router.route('/verify-email').get( verifyEmail );
Router.route('/login').post( login );
Router.route('/logout').post( logout );

export default Router;
