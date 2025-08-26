import express from "express";
import Thread from "../models/Thread.js";
import getChatCompletion from "../utils/openAi.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication to all chat routes
router.use(authenticateToken);

// Test: Create a sample thread
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "xyz",
      title: "HIII"
    });
    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed to save in DB" });
  }
});

// Get all threads for authenticated user, sorted by latest
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

// Get thread messages by threadId (only for authenticated user)
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId, userId: req.user._id });
    if (!thread) {
      return res.status(404).json({ error: "Thread is not found" });
    }
    res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

// Delete a thread (only for authenticated user)
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId, userId: req.user._id });
    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Cannot delete thread" });
  }
});

// MAIN CHAT ENDPOINT: Add user message, get assistant reply
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;
  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing required field" });
  }
  try {
    let thread = await Thread.findOne({ threadId, userId: req.user._id });
    if (!thread) {
    
      thread = new Thread({
        threadId,
        userId: req.user._id,
        title: message,
        messages: [{ role: "user", content: message }]
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    // Get AI response
    const assistantReply = await getChatCompletion(message);
    thread.messages.push({ role: "assistant", content: assistantReply });

    thread.updatedAt = new Date();
    await thread.save();

    res.json({ reply: assistantReply });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
