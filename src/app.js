import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import { errorHandler } from "./middlewares/ErrorHandler.js";
import { connectDB } from "./configurations/mongoContext.js";
import prefix from "./settings/prefix.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import welcomeRoute from "./routes/welcomeRoute.js";
import pawnContractRoutes from "./routes/pawnContractRoutes.js";
import pawnItemRoutes from "./routes/pawnItemRoutes.js";
import liquidationContractRoutes from "./routes/liquidationContractRoutes.js";
import interestRateRoutes from "./routes/interestRateRoutes.js";
import trashRoutes from "./routes/trashRoutes.js"

connectDB();
const app = express();
http.createServer(app);
const port = process.env.PORT ?? 9090;
app.use(cors());
app.use(express.json());

app.use("/", welcomeRoute);
app.use(prefix.APP_REFIX + "auth", authRoutes);
app.use(prefix.APP_REFIX + "user", userRoutes);
app.use(prefix.APP_REFIX + "admin", adminRoutes);
app.use(prefix.APP_REFIX + "pawnContract", pawnContractRoutes);
app.use(prefix.APP_REFIX + "trash", trashRoutes);
app.use(prefix.APP_REFIX + "liquidationContract", liquidationContractRoutes);
app.use(prefix.APP_REFIX + "pawnItem", pawnItemRoutes);
app.use(prefix.APP_REFIX + "interestRate", interestRateRoutes);

app.all("*", (req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl} on this server!`);
  res.status(404);
  next(error);
});

app.use(prefix.APP_REFIX, errorHandler);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
