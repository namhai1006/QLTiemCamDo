const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authMiddleware = require('./middlewares/authMiddleware');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/auth', require('./routes/authRoutes'));               // Route đăng ký, đăng nhập
app.use('/admin', authMiddleware, require('./routes/adminRoutes')); // Route admin được bảo vệ bằng authMiddleware
app.use('/contracts', authMiddleware, require('./routes/contractRoutes')); // Route hợp đồng cầm đồ, yêu cầu xác thực
app.use('/liquidations', authMiddleware, require('./routes/liquidationRoutes')); // Route thanh lý, yêu cầu xác thực
app.use('/rates', authMiddleware, require('./routes/interestRateRoutes')); // Route lãi suất, yêu cầu xác thực

// Error handling middleware
app.use(errorHandler);  // Error handling middleware imported

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
