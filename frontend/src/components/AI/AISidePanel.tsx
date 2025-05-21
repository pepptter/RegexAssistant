import React from "react";
import { formatExplanation } from "../utils/AI";

interface Props {
  regex: string;
  name: string;
  explanation: string | null;
  loading: boolean;
  onClose: () => void;
}

const AISidePanel: React.FC<Props> = ({ regex, name, explanation, loading, onClose }) => {
  return (
    <div className="ai-side-panel open">
      <div className="side-panel-header">
        <h5>Explanation</h5>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div className="side-panel-body">
        <p><strong>{name}</strong></p>
        <p><code>{regex}</code></p>
        <div>
          {loading ? <p>Loading explanation...</p> : <p>{formatExplanation(explanation || "")}</p>}
        </div>
      </div>
    </div>
  );
};

export default AISidePanel;
