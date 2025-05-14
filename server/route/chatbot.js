import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    const response = await axios.post("http://localhost:5001/chatbot", { message });
    res.json(response.data);
  } catch (error) {
    console.error("Chatbot error:", error.message);
    res.status(500).json({ reply: "Chatbot server error." });
  }
});

export default router;
