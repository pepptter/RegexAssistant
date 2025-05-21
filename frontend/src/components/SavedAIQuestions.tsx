import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { formatExplanation } from "./utils/AI";
import { showToast } from "./utils/toast";

interface AIQuestion {
  id: number;
  mode: string;
  input: string;
  prompt: string;
  response: string;
}

const SavedAIQuestions: React.FC = () => {
  const { token } = useAuth();
  const [questions, setQuestions] = useState<AIQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchQuestions = async () => {
      try {
        const res = await fetch("https://localhost:7013/api/aiquestions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch saved questions.");
        const data = await res.json();
        setQuestions(data);
      } catch (err: any) {
        setError(err.message || "Error fetching data.");
      }
    };

    fetchQuestions();
  }, [token]);

  const confirmDelete = async () => {
  if (!confirmDeleteId) return;

  try {
    const res = await fetch(`https://localhost:7013/api/aiquestions/${confirmDeleteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Delete failed");

    setQuestions(prev => prev.filter(q => q.id !== confirmDeleteId));
    showToast("Deleted successfully.");
    setConfirmDeleteId(null);
  } catch (err: any) {
    console.error(err);
    showToast("Could not delete question.");
  }
};


  return (
    <div className="dashboard-section">
      <div className="saved-ai-questions">
        <h2>Saved AI Questions</h2>
        {error && <p className="text-danger">{error}</p>}
        {questions.length === 0 ? (
          <p>You have no saved AI questions.</p>
        ) : (
          <div className="question-list">
            {questions.map((q) => (
              <div key={q.id} className="question-card mb-3 p-3 border rounded bg-light">
                <strong>Mode:</strong> {q.mode} <br />
                <strong>Input:</strong> {q.input} <br />
                <strong>Prompt:</strong> {q.prompt} <br />
                <strong>Response:</strong>
                <div className="mt-1">{formatExplanation(q.response)}</div>
                <button className="btn btn-danger mt-2" onClick={() => setConfirmDeleteId(q.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}{confirmDeleteId !== null && (
          <>
            <div className="confirm-overlay" onClick={() => setConfirmDeleteId(null)} />
            <div className="confirm-modal">
              <p>Are you sure you want to delete this AI question?</p>
              <div className="d-flex justify-content-center gap-2 mt-3">
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Yes, Delete
                </button>
                <button className="btn btn-secondary" onClick={() => setConfirmDeleteId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SavedAIQuestions;
