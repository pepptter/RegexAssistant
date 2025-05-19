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
    <div className="home container py-5">
      <h1 className="title">Welcome to Regex Assistant</h1>
      {!token && (
        <>
          <p className="intro">
            Please log in or register to save regexes and access more features.
          </p>
          <div className="buttons mb-4">
            <a href="/login" className="btn btn-outline-primary me-2">
              Login
            </a>
            <a href="/register" className="btn btn-primary">
              Register
            </a>
          </div>
          <CommonRegexList canSave={false} />
        </>
      )}
    </div>
  );
};

export default Home;
