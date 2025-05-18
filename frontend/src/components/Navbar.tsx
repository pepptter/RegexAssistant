import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="links">
        {!token && (
          <>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {token && <Link to="/">Home</Link>}
      </div>
      {token && (
        <button onClick={handleLogout} className="logoutButton">
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
