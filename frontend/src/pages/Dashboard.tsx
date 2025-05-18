import { useAuth } from "../context/AuthContext";
import SaveFeature from "../components/SaveFeature";
import AIComponent from "../components/AIComponent";
import { useNavigate } from "react-router-dom";
import CommonRegexList from "../components/CommonRegexList";
import UserRegexList from "../components/UserRegexList";

const Dashboard = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  if (!token) {
    navigate("/login");
    return null;
  }

   return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="dashboard-description">
        Welcome! Here you can manage and explore regex patterns.
      </p>

      <SaveFeature />
      <AIComponent />
      <CommonRegexList canSave={true} />
      <UserRegexList />


      <button onClick={logout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
