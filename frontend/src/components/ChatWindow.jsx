import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "../MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { ScaleLoader } from "react-spinners";

// API base URL from environment variable - use relative path in production, absolute in development
// In production, use empty string (relative paths), in development use full backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL !== undefined ?
  import.meta.env.VITE_API_BASE_URL :
  (import.meta.env.PROD ? '' : 'http://localhost:5000/api');

function ChatWindow({ onToggleSidebar, isSidebarOpen }) {
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
  const menuRef = useRef(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const getReply = async () => {
    if (!prompt.trim()) return;

    setLoading(true);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThread,
      }),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, options);
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="chatWindow">
      <div className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            className="mobile-menu-btn"
            onClick={onToggleSidebar}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: '#e0e0e0',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '0.5rem'
            }}
          >
            ☰
          </button>
          <span>
            🤖 AetherBot ▼
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
            📤
          </div>
        </div>
        <p className="info">Aetherbot can make mistakes</p>
      </div>
    </div>
  );
}

export default ChatWindow;
