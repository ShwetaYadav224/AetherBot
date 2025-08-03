import "./Chat.css";
import { useContext } from "react";
import { MyContext } from "./MyContext";
function Chat(){
    const {newChats}=useContext(MyContext);

    return(
        <>
            {newChats && <h1>Start A New Chat</h1>}
            <div className="chats">
                <div className="userDiv">
                    <p className="userMessage">UserMessage</p>
                </div>
                <div className="aetherdiv">
                     <p className="userMessage">AetherBOt Generated msgs</p>
                </div>
            </div>
        </>
    );
}
export default Chat;