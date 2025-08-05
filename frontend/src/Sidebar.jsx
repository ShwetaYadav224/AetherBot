import "./Sidebar.css"
import {useContext, useEffect} from "react";
import { MyContext } from "./MyContext.jsx";

function Sidebar(){
    const {allThreads, setAllThreads}=useContext(MyContext);
    const getAllThreads=async()=>{
        try{
            fetch("http://localhost:5000/api/thread");

        }catch(err){
console.log(err);
        }

    };
    useEffect(()=>{
        getAllThreads();

    },[currThreadId]);  
    return(
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
                    <li className="history-item active">
                        <i className="fa-solid fa-message"></i>
                        <span>Current conversation</span>
                    </li>
                    <li className="history-item">
                        <i className="fa-solid fa-message"></i>
                        <span>Previous chat 1</span>
                    </li>
                    <li className="history-item">
                        <i className="fa-solid fa-message"></i>
                        <span>Previous chat 2</span>
                    </li>
                    <li className="history-item">
                        <i className="fa-solid fa-message"></i>
                        <span>Previous chat 3</span>
                    </li>
                </ul>
            </div>
            
            <div className="sidebar-footer">
                <div className="sign">
                    <i className="fa-solid fa-robot"></i>
                    <p>AetherBot <span className="heart">&hearts;</span></p>
                </div>
            </div>
        </section>
    )
}

export default Sidebar;
