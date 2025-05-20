import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAIExplanation } from "./utils/ai";
import AIModal from "./AIModal";

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
  const [loading, setLoading] = useState(false);
  const [aiExplanation, setAIExplanation] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<RegexPattern | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    fetch("https://localhost:7013/api/regex/public")
      .then((res) => res.json())
      .then((data: RegexPattern[]) => setPatterns(data))
      .catch((err) => console.error("Failed to load regex patterns:", err));
  }, []);

  const handleExplain = async (pattern: RegexPattern) => {
    setLoading(true);
    setSelectedPattern(pattern);
    setModalOpen(true);
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

  const closeModal = () => {
    setModalOpen(false);
    setAIExplanation(null);
    setSelectedPattern(null);
  };

  return (
    <div className="common-regex-list">
      <h2>Common Regexes</h2>
      <p>Some commonly used regexes</p>

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
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary btn-sm" onClick={() => onSave?.(p)}>Save</button>
                    <button
                      className="btn btn-outline-info btn-sm"
                      onClick={() => handleExplain(p)}
                      disabled={loading && selectedPattern?.id === p.id}
                    >
                      {loading && selectedPattern?.id === p.id ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Explaining...
                        </>
                      ) : (
                        "Explain more (AI)"
                      )}
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && selectedPattern && (
        <AIModal
          regex={selectedPattern.pattern}
          explanation={aiExplanation}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default CommonRegexList;
