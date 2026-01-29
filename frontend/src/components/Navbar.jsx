import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">✍️</span>
                    <span className="logo-text">BlogAI</span>
                </Link>

                <div className="navbar-links">
                    <Link to="/" className="nav-link">Home</Link>

                    {user ? (
                        <>
                            <Link to="/my-blogs" className="nav-link">My Blogs</Link>
                            <Link to="/create" className="nav-link nav-link-primary">
                                <span>+ Write</span>
                            </Link>
                            <div className="nav-user">
                                <span className="user-name">{user.name}</span>
                                <button onClick={handleLogout} className="logout-btn">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link nav-link-primary">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
