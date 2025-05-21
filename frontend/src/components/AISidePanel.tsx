import React, { useState } from "react";
import { formatExplanation } from "./utils/AI";

interface AISidePanelProps {
  isOpen: boolean;
  pattern: { name: string; pattern: string; savedExplanation?: string } | null;
  explanation: string | null;
  loading: boolean;
  onClose: () => void;
  onSaveExplanation?: () => void;
  onDeleteExplanation?: () => void;
}

const AISidePanel: React.FC<AISidePanelProps> = ({
  isOpen,
  pattern,
  explanation,
  loading,
  onClose,
  onSaveExplanation,
  onDeleteExplanation,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!pattern) return null;

  return (
    <div className={`side-panel ${isOpen ? "open" : ""} ${expanded ? "expanded" : ""}`}>
      <div className="side-panel-header">
        <h5>Explanation</h5>
        <div className="side-panel-buttons">
          <button className="btn-expand" onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? "Collapse" : "Expand"}
          </button>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
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
        {explanation &&
          (onSaveExplanation && !pattern.savedExplanation ? (
            <button className="btn-save-explanation mt-3" onClick={onSaveExplanation}>
              Save Explanation
            </button>
          ) : onDeleteExplanation ? (
            <button className="btn-delete-explanation mt-3" onClick={onDeleteExplanation}>
              Delete Saved Explanation
            </button>
          ) : null)}
      </div>
    </div>
  );
};

export default AISidePanel;
