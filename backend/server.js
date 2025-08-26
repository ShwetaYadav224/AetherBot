import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import chatRoutes from "./routes/chat.js"
import authRoutes from "./routes/auth.js"

import  getChatCompletion  from './utils/openAi.js'; // Import your utility

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} | Body:`, req.body);
  next();
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
