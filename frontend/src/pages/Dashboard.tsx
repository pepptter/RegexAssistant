import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SaveFeature from "../components/SaveFeature";
import AIComponent from "../components/AIComponent";
import CommonRegexList from "../components/CommonRegexList";
import UserRegexList from "../components/UserRegexList";
import logolarge from "../assets/logotype-large.png";

const Dashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token) return null;

  return (
    <div className="dashboard container py-4">
      <div className="dashboard-header">
        <img src={logolarge} alt="Logo" />
        <div>
          <h1 className="mb-3 text-primary">Dashboard</h1>
          <p className="mb-4 text-secondary">
            Welcome! Here you can manage and explore regex patterns.
          </p>
        </div>
      </div>


      <div className="mb-4">
        <SaveFeature />
      </div>

      <div className="mb-4">
        <AIComponent />
      </div>

      <div className="mb-4">
        <CommonRegexList canSave={true} />
      </div>

      <div className="mb-4">
        <UserRegexList />
      </div>
    </div>
  );
};

export default Dashboard;
