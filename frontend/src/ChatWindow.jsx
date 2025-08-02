import "./ChatWindow.css"
import Chat from "./Chat";
function ChatWindow(){
    return(<div className="chatWindow">
        <div className="navbar">
            <span>AetherBot <i class="fa-solid fa-chevron-down"></i></span>
            <div className="userIconDiv">
               <span><i class="fa-solid fa-user"></i></span> 
            </div>
        </div>
        <Chat></Chat>
        <div className="chatInput"></div>
    </div>)
}
export default ChatWindow;  