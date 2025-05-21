import { useAuth } from "../context/AuthContext";
import RegexForm from "./RegexForm";
import { useState } from "react";

const SaveFeature = () => {
  const { token } = useAuth();
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async (data: {
  name: string;
  pattern: string;
  description?: string;
  savedAIExplanation?: string;
}) => {
  if (!token) {
    setMessage("You must be logged in to save.");
    return;
  }

  try {
    const response = await fetch("https://localhost:7013/api/regex", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText);
    }

    setMessage("Regex saved successfully!");
  } catch (err: any) {
    setMessage(err.message || "Something went wrong.");
  }
};


  return (
    <div className="dashboard-section">
      <div className="save-feature mb-4">
        <h2>Create And Save Your Regex</h2>
        <RegexForm onSubmit={handleSave} />
        {message && (
          <p className="save-message mt-3 text-center text-success">
            {message}
          </p>
        )}
    </div>
  </div>
  );
};

export default SaveFeature;
