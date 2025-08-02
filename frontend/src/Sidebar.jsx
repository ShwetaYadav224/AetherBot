import "./Sidebar.css"
function Sidebar(){
    return(
    <section className="sidebar">
        <button><i class="fa-solid fa-a"    ></i>
           <span> <i className="fa-solid fa-pen-to-square"></i>
</span>
        </button>
        <ul className="history">
            <li>history1</li>
            <li>history1</li>
            <li>history1</li>
            <li>history1</li>
        </ul>
        <div className="sign">
            <p>AetherBot &hearts;</p>
        </div>
    </section>
    )
}
export default Sidebar;