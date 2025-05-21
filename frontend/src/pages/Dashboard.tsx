import { useEffect, useState } from "react";
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
const [activeTab, setActiveTab] = useState("common");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  if (!token) return null;

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "save":
        return <SaveFeature />;
      case "ai":
        return <AIComponent />;
      case "common":
        return <CommonRegexList canSave={true} />;
      case "user":
        return <UserRegexList />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-menu">
        <button
          className={activeTab === "common" ? "active" : ""}
          onClick={() => setActiveTab("common")}
        >
          Commonly Used regexes
        </button>
        <button
          className={activeTab === "save" ? "active" : ""}
          onClick={() => setActiveTab("save")}
        >
          Create Your Own Regex
        </button>
        <button
          className={activeTab === "user" ? "active" : ""}
          onClick={() => setActiveTab("user")}
        >
          My Saved Regexes
        </button>
        <button
          className={activeTab === "ai" ? "active" : ""}
          onClick={() => setActiveTab("ai")}
        >
          Ask AI
        </button>

      </aside>

      <main className="dashboard container py-4">
        {activeTab === "common" && (
          <div className="dashboard-header">
            <img src={logolarge} alt="Logo" />
            <div>
              <h1 className="mb-3 text-primary">Dashboard</h1>
              <p className="mb-4 text-secondary">
                Welcome! Here you can manage and explore regex patterns.
              </p>
            </div>
          </div>
        )}


        <div className="dashboard-content">{renderActiveComponent()}</div>
      </main>
    </div>
  );
};

export default Dashboard;
