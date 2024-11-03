import express from "express";
import { verifyAccessToken } from "../middlewares/verifyAccess.js";
import { PawnItem } from "../models/PawnItem.js";
import { Trash } from "../models/Trash.js";

const Router = express.Router();

// Get all pawn items
Router.get("/get-all-pawn-item", verifyAccessToken, async (req, res, next) => {
    try {
        const items = await PawnItem.find();
        const role = req.user.role; // Assuming req.user contains the user data with role
        const name = req.user.name;
        const email = req.user.email;
        res.render('pawnItem/listitem', { items, role, name, email });
    } catch (error) {
        next(new Error("Error retrieving items"));
    }
});

// Create a pawn item
Router.post("/create-pawn-item", verifyAccessToken, async (req, res, next) => {
    try {
        const item = new PawnItem({...req.body, creator: req.user.id});
        await item.save();
        res.redirect('/api/v1/pawnItem/get-all-pawn-item');
    } catch (error) {
        next(new Error("Error creating item"));
    }
});

// Render create item page
Router.get("/create-pawn-item", (req, res) => {
    const role = req.user ? req.user.role : null;
    res.render('pawnItem/createItem', { role });
});

// Get pawn item by ID (view item details)
Router.get("/get-pawn-item-by-id/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await PawnItem.findById(id).populate('creator');
        if (!item) {
            return res.status(404).render('error', { message: "Item not found" });
        }
        const role = req.user ? req.user.role : 'employee'; // Assuming req.user contains the user data with role
        res.render('pawnItem/viewitem', { item, role});
    } catch (error) {
        console.log(error);
        next(new Error("Error retrieving item by ID"));
    }
});

// Delete a pawn item
Router.delete("/delete-pawn-item/:id", verifyAccessToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await PawnItem.findById(id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Move item to Trash before deleting
        await Trash.create({
            itemType: "PawnItem",
            itemId: item._id,
            data: item,
            deletedAt: new Date(),
            daysRemaining: 7,
        });

        await item.remove();
        res.render('pawnItem/deleteitem');
    } catch (error) {
        next(new Error("Error deleting item"));
    }
});

// Function to delete item via fetch (for frontend use)
Router.get("/delete-pawn-item/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const response = await fetch(`/api/v1/pawnItem/delete-pawn-item/${id}?_method=DELETE`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete item');
        }
        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.error("Error with fetch operation:", error);
    }
});

export default Router;
