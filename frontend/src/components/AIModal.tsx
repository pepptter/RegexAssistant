import React from "react";

interface AIModalProps {
  regex: string;
  explanation: string | null;
  onClose: () => void;
}

const AIModal: React.FC<AIModalProps> = ({ regex, explanation, onClose }) => {
  return (
    <div className="ai-modal-backdrop" onClick={onClose}>
      <div className="ai-modal" onClick={e => e.stopPropagation()}>
        <div className="ai-modal-header">
          <h5>Regex Explanation</h5>
          <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
        </div>
        <div className="ai-modal-body">
          <p><strong>Regex:</strong> <code>{regex}</code></p>
          <p>{explanation || "Loading explanation..."}</p>
        </div>
        <div className="ai-modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default AIModal;
