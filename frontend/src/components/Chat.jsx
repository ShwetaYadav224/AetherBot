import "./Chat.css";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "../MyContext";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChats, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    if (!reply) return;
    
    // Only show typing animation if this is a new reply that hasn't been added to prevChats yet
    const lastChat = prevChats?.[prevChats.length - 1];
    const isNewReply = !lastChat || lastChat.content !== reply;
    
    if (isNewReply) {
      const content = reply.split(" ");
      let idx = 0;
      const interval = setInterval(() => {
        setLatestReply(content.slice(0, idx + 1).join(" "));
        idx++;
        if (idx >= content.length) {
          clearInterval(interval);
          // After typing completes, set latestReply to null to hide typing indicator
          setTimeout(() => setLatestReply(null), 1000);
        }
      }, 40);
      return () => clearInterval(interval);
    } else {
      setLatestReply(null);
    }
  }, [prevChats, reply]);

  return (
    <div className="chat-container">
      {newChats && (
        <div className="welcome-message">
          <h1>Start A New Chat</h1>
        </div>
      )}
      <div className="chats">
        {prevChats?.map((chat, idx) => (
          <div
            className={`message-wrapper ${
              chat.role === "user" ? "user-wrapper" : "ai-wrapper"
            }`}
            key={idx}
          >
            <div
              className={`message ${
                chat.role === "user" ? "user-message" : "ai-message"
              }`}
            >
              {chat.role === "user" ? (
                <p>{chat.content}</p>
              ) : (
                <Markdown rehypePlugins={[rehypeHighlight]}>
                  {chat.content}
                </Markdown>
              )}
            </div>
          </div>
        ))}
        
        {prevChats.length > 0 && latestReply !== null && (
          <div className="message-wrapper ai-wrapper typing-message">
            <div className="message ai-message">
              <Markdown rehypePlugins={[rehypeHighlight]}>
                {latestReply}
              </Markdown>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
