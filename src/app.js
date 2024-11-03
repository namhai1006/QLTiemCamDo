import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from 'express-session'; // Thêm import session
import methodOverride from 'method-override';
import path from "path";
import { connectDB } from "./configurations/mongoContext.js";
import { errorHandler } from "./middlewares/ErrorHandler.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRouter from './routes/dashboard.js';
import interestRateRoutes from "./routes/interestRateRoutes.js";
import liquidationContractRoutes from "./routes/liquidationContractRoutes.js";
import pawnContractRoutes from "./routes/pawnContractRoutes.js";
import pawnItemRoutes from "./routes/pawnItemRoutes.js";
import trashRouter from "./routes/trashRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import welcomeRoute from "./routes/welcomeRoute.js";
import prefix from "./settings/prefix.js";
dotenv.config();

// Kết nối cơ sở dữ liệu
connectDB();

const app = express();
const port = process.env.PORT ?? 9090;

// Cấu hình middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Để parse URL-encoded bodies

// Thiết lập static files
app.use('/views/dist/assets', express.static('views/dist/assets'));
app.use('/views/dist/dashboard', express.static('views/dist/dashboard'));
app.use('/views/dist/assets/images', express.static('views/dist/assets/images'));
app.use('/assets/images', express.static(path.join(process.cwd(), 'assets/images')));
app.use('/views/images', express.static('views/images'));
app.use('/views', express.static('views'));
app.use('/assets/images', express.static('assets/images'));
app.use('/views/dist/assets/css', express.static('views/dist/assets/css'));
app.use('/pawnContract/dist/assets/css', express.static('/pawnContract/dist/assets/css'));
app.use('/api/v1/pawnContract/dist', express.static(path.join(process.cwd(), 'dist')));
app.use('/views/dist/assets/js/plugins', express.static('/views/dist/assets/js/plugins'));
// Thiết lập view engine
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views')); // Đường dẫn đến thư mục views
app.use(express.static(path.join(process.cwd(), 'views'))); // Đảm bảo đường dẫn đúng
app.use(methodOverride('_method'));
// Cấu hình session
app.use(
  session({
    secret: 'your_secret_key', // Thay thế bằng khóa bí mật thực tế của bạn
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Để `true` nếu chạy trên HTTPS
  })
);

console.log("Prefix: ", prefix.APP_REFIX);

// Cấu hình routes
app.use('/', dashboardRouter);
app.use("/", welcomeRoute);
app.use(prefix.APP_REFIX + "auth", authRoutes);
app.use(prefix.APP_REFIX + "user", userRoutes);
app.use(prefix.APP_REFIX + "admin", adminRoutes);
app.use(prefix.APP_REFIX + "pawnContract", pawnContractRoutes);
app.use(prefix.APP_REFIX + "liquidationContract", liquidationContractRoutes);
app.use(prefix.APP_REFIX + "pawnItem", pawnItemRoutes);
app.use(prefix.APP_REFIX + "interestRate", interestRateRoutes);
app.use(prefix.APP_REFIX + "trash", trashRouter);

// Xử lý yêu cầu không tìm thấy (404)
app.all("*", (req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl} on this server!`);
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log("Incoming request headers:", req.headers);
  res.status(404);
  next(error);
});

// Middleware xử lý lỗi
app.use(prefix.APP_REFIX, errorHandler);

// Khởi động máy chủ
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
