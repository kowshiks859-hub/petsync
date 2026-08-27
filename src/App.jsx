import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Selection from './pages/Selection';
import AIMatch from './pages/AIMatch';
import Adoption from './pages/Adoption';
import Settings from './pages/Settings';
import PetManagement from './pages/Admin/PetManagement';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AddPet from './pages/Admin/AddPet';
import Requests from './pages/Admin/Requests';
import AdminLayout from './components/AdminLayout';

const API = '';

function AppContent({ auth, login, logout }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!auth.isAuthenticated) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(auth.role)) return <Navigate to="/" />;
    return children;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {!isAdminRoute && <Navbar auth={auth} logout={logout} />}
      
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home auth={auth} />} />
          <Route path="/login" element={
            auth.isAuthenticated ? <Navigate to="/" /> : <Login login={login} />
          } />
          <Route path="/register" element={
            auth.isAuthenticated ? <Navigate to="/" /> : <Register login={login} />
          } />
          
          {/* User Routes */}
          <Route path="/selection" element={
            <ProtectedRoute allowedRoles={['user']}>
              <Selection auth={auth} />
            </ProtectedRoute>
          } />
          <Route path="/match" element={
            <ProtectedRoute allowedRoles={['user']}>
              <AIMatch auth={auth} />
            </ProtectedRoute>
          } />
          <Route path="/adoption" element={
            <ProtectedRoute allowedRoles={['user']}>
              <Adoption auth={auth} />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['bluecross']}><AdminLayout logout={logout} /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" />} />
            <Route path="dashboard" element={<AdminDashboard auth={auth} />} />
            <Route path="pets" element={<PetManagement />} />
            <Route path="pets/add" element={<AddPet />} />
            <Route path="pets/edit/:id" element={<AddPet />} />
            <Route path="requests" element={<Requests auth={auth} />} />
          </Route>

          {/* Shared Protected Route */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings auth={auth} />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  const [auth, setAuth] = useState(() => {
    try {
      const saved = localStorage.getItem('auth');
      return saved ? JSON.parse(saved) : { isAuthenticated: false, role: null, userName: null, token: null, user: null };
    } catch {
      return { isAuthenticated: false, role: null, userName: null, token: null, user: null };
    }
  });

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  // Verify token is still valid on load
  useEffect(() => {
    if (auth.isAuthenticated && auth.token) {
      fetch(`${API}/api/me`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      }).catch(() => {
        // Server not reachable — keep session optimistically
      }).then(res => {
        if (res && !res.ok) logout(); // Token invalid
      });
    }
  }, []);

  const login = (role, userName, token, user) => {
    setAuth({ isAuthenticated: true, role, userName, token, user });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setAuth({ isAuthenticated: false, role: null, userName: null, token: null, user: null });
  };

  return (
    <Router>
      <AppContent auth={auth} login={login} logout={logout} />
    </Router>
  );
}

export default App;
