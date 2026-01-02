import express from "express";
import Thread from "../models/Thread.js";
import getChatCompletion from "../utils/openAi.js";
import {
  chatValidationSchemas,
  sanitizationRules,
  combinedValidation
} from "../middleware/validation.js";

const router = express.Router();

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

// Get all threads for a specific user, sorted by latest
router.get("/thread", async (req, res) => {
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ error: "User email is required" });
  }

  try {
    const threads = await Thread.find({ userEmail }).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

// Get thread messages by threadId
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ error: "User email is required" });
  }

  // Validate threadId parameter
  const { error } = chatValidationSchemas.threadId.validate({ threadId });
  if (error) {
    return res.status(400).json({ error: 'Invalid thread ID' });
  }
  try {
    const thread = await Thread.findOne({ threadId, userEmail });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found or access denied" });
    }
    res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

// Delete a thread
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ error: "User email is required" });
  }

  // Validate threadId parameter
  const { error } = chatValidationSchemas.threadId.validate({ threadId });
  if (error) {
    return res.status(400).json({ error: 'Invalid thread ID' });
  }
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId, userEmail });
    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found or access denied" });
    }
    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Cannot delete thread" });
  }
});

// MAIN CHAT ENDPOINT: Add user message, get assistant reply
router.post("/chat",
  combinedValidation(chatValidationSchemas.chat, sanitizationRules.chat),
  async (req, res) => {
    const { threadId, message, userEmail } = req.body;
    try {
      let thread = await Thread.findOne({ threadId, userEmail });
      if (!thread) {

        thread = new Thread({
          threadId,
          userEmail,
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
