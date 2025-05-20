import express from "express";
import { chatbotResponse } from "../controllers/chatbot.controller.js"; // Ensure the correct path

const router = express.Router();

router.post("/chatbot", chatbotResponse);

export default router;
