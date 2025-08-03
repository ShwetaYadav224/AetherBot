import "./ChatWindow.css"
import Chat from "./Chat";
import { MyContext } from "./MyContext";
import { useContext, useState } from "react";
import {ScaleLoader} from "react-spinners";

function ChatWindow() {
  const { prompt, setPrompt, reply, setReply, currThread, setCurrThread } = useContext(MyContext);
  const [loading,setLoading]=useState(false);


  const getReply = async () => {
    setLoading(true);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThread
      })
    };
    try {
      const response = await fetch("http://localhost:5000/api/chat", options);
      
      const res = await response.json();
      console.log(res);
     setReply(res.reply);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>AetherBot <i className="fa-solid fa-chevron-down"></i></span>
        <div className="userIconDiv">
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      <Chat />
      <ScaleLoader color="white" loading={loading}></ScaleLoader>
      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">Aetherbot can make mistake</p>
      </div>
    </div>
  );
}
export default ChatWindow;
