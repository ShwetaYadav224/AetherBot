import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { use, useState } from "react";
import {v1 as uuidv1} from "uuid";
function App() {
  const [prompt,setPrompt]=useState("");
  const [reply,setReply]=useState(null);
  const [currThread,setCurrThread]=useState(uuidv1);
  const [prevChats,setChats]=useState([]);//previous chats of current threats
  const [newChats,setNewChats]=useState(true);
  const providerValues={
    prompt,setPrompt,
    reply,setReply,
    currThread,setCurrThread,
    prevChats,setChats,
    newChats,setNewChats
  };
  return (
    <div className="app ">
      <MyContext.Provider value={providerValues}>
      <Sidebar></Sidebar>
      <ChatWindow></ChatWindow>      
      </MyContext.Provider>
    </div>
  )
}

export default App
