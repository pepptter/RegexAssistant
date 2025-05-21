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
    <div className="home container py-5 d-flex flex-column justify-content-center align-items-center">
      <h1 className="title text-center mb-4">Welcome to Regex Assistant</h1>
      {!token && (
        <>
          <p className="intro text-center mb-4">
            Please log in or register to use the AI, create and save regexes and more!
          </p>
          <div className="buttons mb-4 d-flex justify-content-center gap-3">
            <a href="/login" className="btn btn-login">
              Login
            </a>
            <a href="/register" className="btn btn-login">
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
