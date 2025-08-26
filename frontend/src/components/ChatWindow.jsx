import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "../MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { ScaleLoader } from "react-spinners";
import { useAuth } from '../AuthContext';

// API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { token, logout, user } = useAuth();
  const menuRef = useRef(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const getReply = async () => {
    if (!prompt.trim()) return;

    setLoading(true);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
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
        <div className="userIconDiv" ref={menuRef}>
          <span
            className="userIcon"
            onClick={() => {
              console.log('User icon clicked, current showUserMenu:', showUserMenu);
              console.log('User data:', user);
              setShowUserMenu(!showUserMenu);
            }}
            style={{ cursor: 'pointer' }}
          >
            👤
          </span>
          {showUserMenu && (
            <div className="user-menu">
              <div className="user-info">
                <span>{user?.username || 'No username'}</span>
                <span className="user-email">{user?.email || 'No email'}</span>
              </div>
              <div className="menu-divider"></div>
              <button onClick={() => {
                console.log('Logout clicked');
                logout();
              }} className="logout-menu-item">
                Logout
              </button>
            </div>
          )}
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
