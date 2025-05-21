import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as regexService from "../services/regexService";
import useAIExplain from "../hooks/useAIExplain";
import AISidePanel from "./AI/AISidePanel";
import { formatExplanation } from "./utils/AI";

interface RegexPattern {
  id: number;
  name: string;
  pattern: string;
  description: string;
  userId?: string;
}

const UserRegexList = () => {
  const { token } = useAuth();
  const [patterns, setPatterns] = useState<RegexPattern[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { selectedPattern, explanation, loading, handleExplain, closePanel } = useAIExplain();

  useEffect(() => {
    if (!token) return;
    regexService
      .getAll(token)
      .then((res) => {
        const userOnly = res.filter((r: RegexPattern) => r.userId !== null);
        setPatterns(userOnly);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load your saved regexes.");
      });
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this regex?")) return;

    try {
      await regexService.delete(id, token);
      setPatterns((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete pattern.");
    }
  };

  return (
    <div className="user-regex-list">
      <h2>Your Saved Regex Patterns</h2>
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
                    <div className="action-buttons">
                      <button className="btn btn-gray" onClick={() => handleDelete(p.id)}>Delete</button>
                      <button className="btn btn-gray" onClick={() => handleExplain(p)}>
                        {loading && selectedPattern?.id === p.id ? "Explaining..." : "Explain with AI"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedPattern && (
        <AISidePanel
          regex={selectedPattern.pattern}
          name={selectedPattern.name}
          explanation={explanation}
          loading={loading}
          onClose={closePanel}
        />
      )}
    </div>
  );
};

export default UserRegexList;
