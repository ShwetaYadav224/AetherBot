import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";

function Sidebar() {
  const { allThreads, setAllThreads, currThreadId } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/thread"); // ✅ await added here
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
  }, [currThreadId]);

  return (
    <section className="sidebar">
      <div className="sidebar-header">
        <button className="new-chat-btn">
          <div className="btn-content">
            <i className="fa-solid fa-plus"></i>
            <span>New Chat</span>
          </div>
          <i className="fa-solid fa-pen-to-square"></i>
        </button>
      </div>

      <div className="sidebar-content">
        <ul className="history">
          {allThreads?.map((thread) => (
            <li
              key={thread.threadId} // ✅ Unique key
              className={`history-item ${
                currThreadId === thread.threadId ? "active" : ""
              }`} // ✅ Conditionally active
            >
              <i className="fa-solid fa-message"></i>
              <span>{thread.title}</span> {/* ✅ Show thread title */}
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className="sign">
          <i className="fa-solid fa-robot"></i>
          <p>
            AetherBot <span className="heart">&hearts;</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Sidebar;
