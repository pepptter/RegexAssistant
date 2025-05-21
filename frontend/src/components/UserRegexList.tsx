import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAIExplanation } from "./utils/AI";
import AISidePanel from "./AISidePanel";

interface RegexPattern {
  id: number;
  name: string;
  pattern: string;
  description: string;
  userId?: string;
}

const UserRegexList: React.FC = () => {
  const { token } = useAuth();
  const [patterns, setPatterns] = useState<RegexPattern[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [selectedPattern, setSelectedPattern] = useState<RegexPattern | null>(null);
  const [aiExplanation, setAIExplanation] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchRegexes = async () => {
      try {
        const res = await fetch("https://localhost:7013/api/regex", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load regex patterns.");

        const data = await res.json();
        const userOnly = data.filter((r: RegexPattern) => r.userId !== null);
        setPatterns(userOnly);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      }
    };

    fetchRegexes();
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!token) return;

    try {
      const res = await fetch(`https://localhost:7013/api/regex/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete pattern.");

      setPatterns((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Delete failed.");
    }
  };

  const handleExplain = async (pattern: RegexPattern) => {
    setSelectedPattern(pattern);
    setAIExplanation(null);
    setLoading(true);

    try {
      const prompt = `Explain what this regex means: ${pattern.pattern}`;
      const explanation = await getAIExplanation(prompt);
      setAIExplanation(explanation);
    } catch (err) {
      setAIExplanation("AI failed to explain this pattern.");
    } finally {
      setLoading(false);
    }
  };

  const closePanel = () => {
    setSelectedPattern(null);
    setAIExplanation(null);
  };

  return (
    <div className="user-regex-list">
      <h2>My Saved Regexes</h2>
      {error && <p className="text-danger">{error}</p>}

      {patterns.length === 0 ? (
        <p>You haven't saved any patterns yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Pattern</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patterns.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td><code>{p.pattern}</code></td>
                  <td>{p.description}</td>
                  <td>
                    <div className="d-flex flex-column flex-md-row gap-2">
                      <button className="btn btn-gray" onClick={() => handleExplain(p)}>
                        Explain with AI
                      </button>
                      <button className="btn btn-gray" onClick={() => setConfirmDeleteId(p.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {confirmDeleteId !== null && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <p>Are you sure you want to delete this regex?</p>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-secondary" onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => {
                handleDelete(confirmDeleteId);
                setConfirmDeleteId(null);
              }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <AISidePanel
        isOpen={!!selectedPattern}
        pattern={selectedPattern}
        explanation={aiExplanation}
        loading={loading}
        onClose={closePanel}
      />
    </div>
  );
};

export default UserRegexList;
