import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "../MyContext.jsx";

// API base URL from environment variable - use relative path in production, absolute in development
// In production, use empty string (relative paths), in development use full backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL !== undefined ?
  import.meta.env.VITE_API_BASE_URL :
  (import.meta.env.PROD ? '' : 'http://localhost:5000/api');

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
    try {
      const response = await fetch(`${API_BASE_URL}/thread`);
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
      console.log(filteredData);
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
    e.stopPropagation(); // Prevent triggering the chat load
    if (!window.confirm('Are you sure you want to delete this chat?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/thread/${threadId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove the thread from the local state
        setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
        
        // If the deleted thread was the current one, start a new chat
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

  return (
    <section className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <button className="new-chat-btn" onClick={handleNewChat}>
            <div className="btn-content">
              ➕
              <span>New Chat</span>
            </div>
            ✏️
          </button>
          <button
            className="mobile-close-btn"
            onClick={() => onClose && onClose()}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: '#e0e0e0',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '0.5rem',
              marginLeft: '0.5rem'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      <div className="sidebar-content">
        <ul className="history">
          {allThreads?.map((thread) => (
            <li
              key={thread.threadId} // ✅ Unique key
              className={`history-item ${
                currThread === thread.threadId ? "active" : ""
              }`} // ✅ Conditionally active
            >
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <span
                  onClick={async () => {
                    console.log('Loading chat thread:', thread.threadId, thread.title);
                    setCurrThread(thread.threadId);
                    setNewChats(false);
                    setReply(null);
                    
                    // Close sidebar on mobile after selecting a chat
                    if (onClose) {
                      onClose();
                    }
                    
                    // Load the thread messages
                    try {
                      console.log('Fetching messages for thread:', thread.threadId);
                      const response = await fetch(`${API_BASE_URL}/thread/${thread.threadId}`);
                      
                      console.log('Response status:', response.status);
                      
                      if (!response.ok) {
                        const errorText = await response.text();
                        console.log('Error response:', errorText);
                        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                      }
                      
                      const messages = await response.json();
                      console.log('Received messages:', messages);
                      
                      if (Array.isArray(messages)) {
                        // Convert thread messages to prevChats format
                        const formattedChats = messages.map(msg => ({
                          role: msg.role,
                          content: msg.content
                        }));
                        console.log('Setting previous chats:', formattedChats.length, 'messages');
                        setPrevChats(formattedChats);
                      } else {
                        console.log('Response is not an array:', messages);
                        setPrevChats([]);
                      }
                    } catch (err) {
                      console.log("Error loading thread:", err);
                      alert('Failed to load chat. Please try again. Check console for details.');
                      setPrevChats([]);
                    }
                  }}
                  style={{ cursor: 'pointer', flex: 1, display: 'flex', alignItems: 'center' }}
                >
                  💬
                  <span style={{ marginLeft: '8px' }}>{thread.title}</span>
                </span>
                <button
                  onClick={(e) => deleteThread(thread.threadId, e)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#888',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = '#ff4444';
                    e.target.style.background = 'rgba(255, 68, 68, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = '#888';
                    e.target.style.background = 'none';
                  }}
                  title="Delete chat"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className="sign">
          🤖
          <p>
            AetherBot <span className="heart">&hearts;</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Sidebar;
