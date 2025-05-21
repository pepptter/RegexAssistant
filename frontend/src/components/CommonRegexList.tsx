import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAIExplanation, formatExplanation } from "./utils/AI";
import AISidePanel from "./AISidePanel";
import { showToast } from "./utils/toast";

interface RegexPattern {
  id: number;
  name: string;
  pattern: string;
  description: string;
  userId?: string;
  savedExplanation?: string;
}

interface Props {
  canSave?: boolean;
}

const CommonRegexList: React.FC<Props> = ({ canSave = false }) => {
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

  const handleSaveWithExplanation = async () => {
    if (!selectedPattern || !aiExplanation) return;

    let savedId = selectedPattern.id;

    try {
      const checkRes = await fetch("https://localhost:7013/api/regex", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userSaved: RegexPattern[] = await checkRes.json();
      const match = userSaved.find(
        (r) => r.pattern === selectedPattern.pattern || r.name === selectedPattern.name
      );

      if (match) {
        const exists = match.savedExplanation;
        if (exists && !window.confirm("An explanation already exists. Replace it?")) return;

        const put = await fetch(`https://localhost:7013/api/regex/${match.id}/explanation`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(aiExplanation),
        });

        if (!put.ok) throw new Error("Failed to update explanation");

        showToast("Explanation saved!");
        setPatterns((prev) =>
          prev.map((p) => (p.id === match.id ? { ...p, savedExplanation: aiExplanation } : p))
        );
        setSelectedPattern((prev) =>
          prev ? { ...prev, savedExplanation: aiExplanation } : prev
        );
        return;
      }

      const createRes = await fetch("https://localhost:7013/api/regex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: selectedPattern.name,
          pattern: selectedPattern.pattern,
          description: selectedPattern.description,
          savedExplanation: aiExplanation,
        }),
      });

      if (!createRes.ok) throw new Error("Could not save new regex.");

      const saved = await createRes.json();
      setPatterns((prev) =>
        prev.map((p) =>
          p.id === selectedPattern.id ? { ...p, id: saved.id, userId: saved.userId, savedExplanation: aiExplanation } : p
        )
      );

      setSelectedPattern((prev) =>
        prev ? { ...prev, id: saved.id, userId: saved.userId, savedExplanation: aiExplanation } : prev
      );

      showToast("Pattern and explanation saved!");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Save failed.");
    }
  };

  const closePanel = () => {
    setSelectedPattern(null);
    setAIExplanation(null);
  };

  return (
    <div className="common-regex-list">
      <h2>Common Regexes</h2>
      <p>Some commonly used regexes</p>

      <div className="|">
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
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-gray"
                          onClick={async () => {
                            try {
                              const res = await fetch("https://localhost:7013/api/regex", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                  name: p.name,
                                  pattern: p.pattern,
                                  description: p.description,
                                }),
                              });
                              if (!res.ok) {
                                const errorText = await res.text();
                                showToast("Failed to save regex: " + errorText);
                              } else {
                                showToast("Regex saved successfully!");
                              }
                            } catch (err) {
                              console.error(err);
                              showToast("An error occurred while saving.");
                            }
                          }}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-gray"
                          onClick={() => {
                            if (selectedPattern?.id === p.id) {
                              closePanel();
                            } else {
                              handleExplain(p);
                            }
                          }}
                        >
                          {selectedPattern?.id === p.id ? "Hide" : "Explain with AI"}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AISidePanel
          isOpen={!!selectedPattern}
          pattern={selectedPattern}
          explanation={aiExplanation}
          loading={loading}
          onClose={closePanel}
          onSaveExplanation={handleSaveWithExplanation}
        />
            </div>
      </div>
  );
};

export default CommonRegexList;
