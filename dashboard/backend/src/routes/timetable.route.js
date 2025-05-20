import express from 'express';
import { generateTimetable } from '../controllers/timetable.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Route to generate timetable - requires authentication
router.post('/generate', protectRoute, generateTimetable);

export default router;