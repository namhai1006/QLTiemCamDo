import express from 'express';
import { calculateRevenue } from '../controllers/revenueController.js';

const router = express.Router();

// Định nghĩa route cho tính toán doanh thu
router.post('/calculate', calculateRevenue); 

export default router;
