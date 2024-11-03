import express from "express";

const Router = express.Router();

Router.get('/welcome', (req, res, next) => {
    try {
        res.render('Welcome');
        res.status(200).json({
            status: "success",
            message: "Welcome to Pawn"
        });
    } catch (error) {
        next(error);
    }
});

export default Router;
