import express from "express";
import Thread from "../models/Thread.js";
const router=express.Router();
router.post("/test",async(req,res)=>{
    try{
        const thread=new Thread({
            threadId:"xyz",
            title:"HIII"
        })
        const response=await thread.save();
        res.send(response);

    }catch(err){
      console.log(err);
      res.status(500).json({error:"failed to saved in DB"});
    }
});
export default router;