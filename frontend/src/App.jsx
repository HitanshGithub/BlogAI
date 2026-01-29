import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import ViewBlog from './pages/ViewBlog';
import MyBlogs from './pages/MyBlogs';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner-lg"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// Guest Route (redirect if logged in)
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner-lg"></div>
      </div>
    );
  }

  return !user ? children : <Navigate to="/" />;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<ViewBlog />} />

          <Route path="/login" element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          } />

          <Route path="/register" element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          } />

          <Route path="/create" element={
            <ProtectedRoute>
              <CreateBlog />
            </ProtectedRoute>
          } />

          <Route path="/edit/:id" element={
            <ProtectedRoute>
              <EditBlog />
            </ProtectedRoute>
          } />

          <Route path="/my-blogs" element={
            <ProtectedRoute>
              <MyBlogs />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
