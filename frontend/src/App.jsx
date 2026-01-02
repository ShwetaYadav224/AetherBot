import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatApp from './ChatApp';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

// Main App component
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ChatApp />} />
                <Route path="/chat" element={<ChatApp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </Router>
    );
}

export default App;
