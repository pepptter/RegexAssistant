import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CommonRegexList from "../components/CommonRegexList";

const Home = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to the site</h1>
      {!token && (
      <>
        <p>Please log in or register to access more features.</p>
        <a href="/login">Login</a> | <a href="/register">Register</a>
        <CommonRegexList canSave={false} />
      </>
)}
    </div>
  );
};

export default Home;
