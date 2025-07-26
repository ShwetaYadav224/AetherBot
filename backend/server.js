import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import chatRoutes from "./routes/chat.js"

import { getChatCompletion } from './utils/openAi.js'; // Import your utility

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/api",chatRoutes);
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} | Body:`, req.body);
  next();
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body || {};
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Invalid or missing message' });
  }

  try {
    const reply = await getChatCompletion(message, process.env.GROQ_API_KEY);
    res.json({ reply });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
const connectDB=async()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with database");
  }catch(err){  
    console.log("failed connect with DB", err);
  }

}