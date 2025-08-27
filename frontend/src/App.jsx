import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatApp from './ChatApp';
import './App.css';

// Main App component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatApp />} />
        <Route path="/chat" element={<ChatApp />} />
      </Routes>
    </Router>
  );
}

export default App;
