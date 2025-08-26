import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Signup from './components/Signup';
import ChatApp from './ChatApp';
import './App.css';

// Main chat app component (protected)
const MainApp = () => {
  return (
    <div className="app">
      <ChatApp />
    </div>
  );
};

// Root component with routing
const AppRouter = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/chat" replace />} 
        />
        <Route 
          path="/signup" 
          element={!isAuthenticated ? <Signup /> : <Navigate to="/chat" replace />} 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/chat" : "/login"} replace />} 
        />
      </Routes>
    </Router>
  );
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
