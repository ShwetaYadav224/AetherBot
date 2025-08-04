import "./ChatWindow.css";
import Chat from "./Chat";
import { MyContext } from "./MyContext";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThread,
    prevChats,
    setPrevChats,
    setNewChats,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);

  const getReply = async () => {
    if (!prompt.trim()) return;

    setLoading(true);

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: prompt,
        threadId: currThread,
      }),
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

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prev) => [
        ...prev,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);
      setPrompt(""); // Clear input
      setNewChats(false); // Hide "Start New Chat"
    }
  }, [reply]);

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          <i className="fa-solid fa-robot"></i>
          AetherBot <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv">
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      <div className="chatContent">
        <Chat />
        {loading && (
          <div className="loadingContainer">
            <ScaleLoader color="#667eea" height={20} width={3} />
          </div>
        )}
      </div>

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">Aetherbot can make mistakes</p>
      </div>
    </div>
  );
}

export default ChatWindow;
