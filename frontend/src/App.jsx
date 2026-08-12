import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Dashboard Route (Accessible by Admin, Manager, User roles) */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Manager', 'User']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all fallback navigation redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
