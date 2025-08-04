import "./Chat.css";
import { useContext } from "react";
import { MyContext } from "./MyContext";

function Chat() {
  const { newChats, prevChats } = useContext(MyContext);

  return (
    <>
      {newChats && <h1>Start A New Chat</h1>}
      <div className="chats">
        {prevChats?.map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "aetherdiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <p className="aetherMessage">{chat.content}</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Chat;
