import express from 'express';
import { register, login, logout } from '../controllers/authController.js';

const Router = express.Router();
Router.route('/register').post(register);
Router.route('/login').post(login);
Router.route('/logout').post(logout);

export default Router;
