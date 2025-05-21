import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAIExplanation } from "./utils/AI";
import { formatExplanation } from "./utils/AI";

interface RegexPattern {
  id: number;
  name: string;
  pattern: string;
  description: string;
}

interface Props {
  canSave?: boolean;
  onSave?: (pattern: RegexPattern) => void;
}

const CommonRegexList: React.FC<Props> = ({ canSave = false, onSave }) => {
  const [patterns, setPatterns] = useState<RegexPattern[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<RegexPattern | null>(null);
  const [aiExplanation, setAIExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetch("https://localhost:7013/api/regex/public")
      .then((res) => res.json())
      .then((data: RegexPattern[]) => setPatterns(data))
      .catch((err) => console.error("Failed to load regex patterns:", err));
  }, []);

  const handleExplain = async (pattern: RegexPattern) => {
    setSelectedPattern(pattern);
    setAIExplanation(null);
    setLoading(true);

    try {
      const prompt = `Explain what this regex means: ${pattern.pattern}`;
      const explanation = await getAIExplanation(prompt);
      setAIExplanation(explanation);
    } catch (err) {
      console.error("AI explanation failed", err);
      setAIExplanation("Sorry, AI could not explain this regex.");
    } finally {
      setLoading(false);
    }
  };

  const closePanel = () => {
    setSelectedPattern(null);
    setAIExplanation(null);
  };

const handleSave = async (pattern: RegexPattern) => {
  try {
    const res = await fetch("https://localhost:7013/api/regex", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to check existing patterns");

    const userPatterns: RegexPattern[] = await res.json();

    const alreadySaved = userPatterns.some(
      (p) => p.pattern === pattern.pattern && p.userId !== null
    );

    if (alreadySaved) {
      alert("You have already saved this pattern.");
      return;
    }

    const saveRes = await fetch("https://localhost:7013/api/regex", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pattern),
    });

    if (!saveRes.ok) throw new Error("Could not save pattern.");
    alert("Pattern saved successfully!");
  } catch (err) {
    alert((err as Error).message);
  }
};




  return (
    <div className="common-regex-list">
      <h2>Common Regexes</h2>
      <p>Some commonly used regexes</p>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Pattern</th>
              <th>Description</th>
              {canSave && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {patterns.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td><code>{p.pattern}</code></td>
                <td>{p.description}</td>
                {canSave && (
                  <>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-gray" onClick={() => handleSave(p)}>
                          Save
                        </button>
                        <button className="btn btn-gray" onClick={() => handleExplain(p)}>
                          Explain with AI
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPattern && (
        <div className={`side-panel ${selectedPattern ? "open" : ""}`}>
          <div className="side-panel-header">
            <h5>Explanation</h5>
            <button className="close-button" onClick={closePanel}>×</button>
          </div>
          <div className="side-panel-body">
            <p><strong>{selectedPattern.name}</strong></p>
            <p><code>{selectedPattern.pattern}</code></p>
            {loading ? (
              <p>Loading explanation...</p>
            ) : aiExplanation ? (
              <p>{formatExplanation(aiExplanation)}</p>
            ) : null}

          </div>
        </div>
      )}
    </div>
  );
};

export default CommonRegexList;
