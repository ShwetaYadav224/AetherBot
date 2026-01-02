import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "../MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { ScaleLoader } from "react-spinners";

// SVG Icons
const MenuIcon = () => (
  <svg viewBox="0 0 24 24">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const BotIcon = () => (
  <svg className="brand-icon" viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
    <circle cx="12" cy="5" r="2"></circle>
    <path d="M12 7v4"></path>
    <line x1="8" y1="16" x2="8" y2="16"></line>
    <line x1="16" y1="16" x2="16" y2="16"></line>
  </svg>
);

const ChevronIcon = () => (
  <svg className="chevron" viewBox="0 0 24 24">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const UserIcon = () => (
  <svg className="user-profile-icon" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LogoutIcon = () => (
  <svg className="logout-icon" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

// API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL !== undefined ?
  import.meta.env.VITE_API_BASE_URL :
  (import.meta.env.PROD ? '' : 'http://localhost:5002/api');

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

  const getReply = async () => {
    if (!prompt.trim()) return;

    setLoading(true);

    const userEmail = localStorage.getItem('userEmail') || 'user@aetherbot.ai';
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThread,
        userEmail: userEmail,
      }),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, options);
      const res = await response.json();
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      getReply();
    }
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prev) => [
        ...prev,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);
      setPrompt("");
      setNewChats(false);
    }
  }, [reply]);

  return (
    <div className="chatWindow">
      <div className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            className="mobile-menu-btn"
            onClick={onToggleSidebar}
          >
            <MenuIcon />
          </button>
          <div className="navbar-brand">
            <BotIcon />
            <div className="navbar-title">
              <span>AetherBot</span>
              <ChevronIcon />
            </div>
          </div>
        </div>

        <div className="navbar-user">
          <div className="user-profile">
            <div className="user-info">
              <div className="user-avatar">
                <UserIcon />
              </div>
              <span className="user-name">
                {localStorage.getItem('userEmail') || 'user@aetherbot.ai'}
              </span>
            </div>
            <button className="logout-btn" onClick={() => {
              localStorage.removeItem('userEmail');
              window.location.href = '/login';
            }} title="Log out">
              <LogoutIcon />
            </button>
          </div>
        </div>
      </div>

      <div className="chatContent">
        <Chat />
        {loading && (
          <div className="loadingContainer">
            <ScaleLoader color="#2563eb" height={20} width={3} />
          </div>
        )}
      </div>

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Type your message..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div id="submit" onClick={getReply}>
            <SendIcon />
          </div>
        </div>
        <p className="info">AetherBot may produce inaccurate information</p>
      </div>
    </div>
  );
}

export default ChatWindow;
