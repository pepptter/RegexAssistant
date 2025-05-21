import React from "react";
import { formatExplanation } from "./utils/AI";

interface AISidePanelProps {
  isOpen: boolean;
  pattern: { name: string; pattern: string } | null;
  explanation: string | null;
  loading: boolean;
  onClose: () => void;
}

const AISidePanel: React.FC<AISidePanelProps> = ({
  isOpen,
  pattern,
  explanation,
  loading,
  onClose,
}) => {
  if (!pattern) return null;

  return (
    <div className={`side-panel ${isOpen ? "open" : ""}`}>
      <div className="side-panel-header">
        <h5>Explanation</h5>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="side-panel-body">
        <p>
          <strong>{pattern.name}</strong>
        </p>
        <p>
          <code>{pattern.pattern}</code>
        </p>
        {loading ? (
          <p>Loading explanation...</p>
        ) : (
          <p>{formatExplanation(explanation || "")}</p>
        )}
      </div>
    </div>
  );
};

export default AISidePanel;
