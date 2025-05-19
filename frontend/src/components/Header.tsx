import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logotype.png";

const Header = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <Link to="/" className="logo-wrap">
            <img src={logo} alt="Logo" className="header-logo" />
            <span className="app-title">Regex Assistant</span>
          </Link>
        </div>

        <nav className="header-nav">
          {!token ? (
            <>
              <Link to="/" className="header-link">Home</Link>
              <Link to="/login" className="header-link">Login</Link>
              <Link to="/register" className="header-link">Register</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="header-link">Dashboard</Link>
            </>
          )}
        </nav>

        {token && (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
