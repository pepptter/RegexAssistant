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
  }) => {
    if (!token) {
      setMessage("You must be logged in to save.");
      return;
    }

    try {
      const response = await fetch("https://localhost:7013/api/regex/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to save pattern.");
      }

      setMessage("Regex saved successfully!");
    } catch (err: any) {
      setMessage(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="save-feature">
      <h2 className="save-title">Save Your Regex</h2>
      <RegexForm onSubmit={handleSave} />
      {message && <p className="save-message">{message}</p>}
    </div>
  );
};

export default SaveFeature;
