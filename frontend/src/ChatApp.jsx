import Sidebar from "./components/Sidebar.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";
import { useAuth } from './AuthContext';

function ChatApp() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThread, setCurrThread] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChats, setNewChats] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { user, logout } = useAuth();

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThread, setCurrThread,
    prevChats, setPrevChats,
    newChats, setNewChats, 
    allThreads, setAllThreads
  };

  return (
    <MyContext.Provider value={providerValues}>
      <div className="app">
        <Sidebar
          isMobileOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        {isSidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <ChatWindow
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
      </div>
    </MyContext.Provider>
  );
}

export default ChatApp;