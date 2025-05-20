import express from "express";
import { generateQuiz, evaluateQuiz } from "../controllers/quiz.controller.js";

const router = express.Router();

router.post("/generate", generateQuiz); // Generate dynamic questions
router.post("/evaluate", evaluateQuiz); // Evaluate user answers

export default router;
