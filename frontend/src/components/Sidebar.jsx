import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../MyContext.jsx";

// SVG Icons as components
const PlusIcon = () => (
  <svg className="btn-icon" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const EditIcon = () => (
  <svg className="btn-icon" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const MessageIcon = () => (
  <svg className="chat-icon" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
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

// API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL !== undefined ?
  import.meta.env.VITE_API_BASE_URL :
  (import.meta.env.PROD ? '/api' : 'http://localhost:5002/api');

function Sidebar({ isMobileOpen, onClose }) {
  const {
    allThreads,
    setAllThreads,
    currThread,
    setCurrThread,
    setNewChats,
    setPrevChats,
    setReply
  } = useContext(MyContext);

  const getAllThreads = async () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    try {
      const response = await fetch(`${API_BASE_URL}/thread?userEmail=${encodeURIComponent(userEmail)}`);
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
    } catch (err) {
      console.log("Error fetching threads:", err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThread]);

  const handleNewChat = () => {
    const newThreadId = Date.now().toString();
    setCurrThread(newThreadId);
    setNewChats(true);
    setPrevChats([]);
  };

  const deleteThread = async (threadId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this chat?')) {
      return;
    }

    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    try {
      const response = await fetch(`${API_BASE_URL}/thread/${threadId}?userEmail=${encodeURIComponent(userEmail)}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
        if (currThread === threadId) {
          handleNewChat();
        }
      } else {
        console.log('Failed to delete thread');
      }
    } catch (err) {
      console.log('Error deleting thread:', err);
    }
  };

  const loadThread = async (thread) => {
    setCurrThread(thread.threadId);
    setNewChats(false);
    setReply(null);

    if (onClose) {
      onClose();
    }

    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    try {
      const response = await fetch(`${API_BASE_URL}/thread/${thread.threadId}?userEmail=${encodeURIComponent(userEmail)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const messages = await response.json();

      if (Array.isArray(messages)) {
        const formattedChats = messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));
        setPrevChats(formattedChats);
      } else {
        setPrevChats([]);
      }
    } catch (err) {
      console.log("Error loading thread:", err);
      setPrevChats([]);
    }
  };

  return (
    <section className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <button className="new-chat-btn" onClick={handleNewChat}>
            <div className="btn-content">
              <PlusIcon />
              <span>New Chat</span>
            </div>
            <EditIcon />
          </button>
          <button
            className="mobile-close-btn"
            onClick={() => onClose && onClose()}
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="sidebar-content">
        <ul className="history">
          {allThreads?.map((thread) => (
            <li
              key={thread.threadId}
              className={`history-item ${currThread === thread.threadId ? "active" : ""}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <span
                  onClick={() => loadThread(thread)}
                  style={{ cursor: 'pointer', flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <MessageIcon />
                  <span>{thread.title}</span>
                </span>
                <button
                  className="delete-btn"
                  onClick={(e) => deleteThread(thread.threadId, e)}
                  title="Delete chat"
                >
                  <TrashIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="brand" style={{ cursor: 'pointer' }}>
            <BotIcon />
            <p>AetherBot</p>
          </div>
        </Link>
      </div>
    </section>
  );
}

export default Sidebar;
