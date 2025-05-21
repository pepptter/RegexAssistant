import { useState } from "react";

type RegexData = {
  name: string;
  pattern: string;
  description?: string;
};

type RegexFormProps = {
  onSubmit?: (data: RegexData) => void;
};

const RegexForm = ({ onSubmit }: RegexFormProps) => {
  const [name, setName] = useState("");
  const [pattern, setPattern] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !pattern.trim()) {
      setError("Name and regex pattern are required.");
      return;
    }

    setError(null);

    onSubmit?.({
      name: name.trim(),
      pattern: pattern.trim(),
      description: description.trim(),
    });

    setName("");
    setPattern("");
    setDescription("");
  };

  return (
    <div className="dashboard-section">
      <form onSubmit={handleSubmit} className="regex-form mx-auto">
        <h3 className="mb-4">Add a Regex Pattern</h3>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Pattern Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Regex Pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            placeholder="Optional Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
            rows={3}
          />
        </div>
        <button type="submit" className="btn btn-gray w-100">
          Save Pattern
        </button>
        {error && <p className="text-danger mt-3">{error}</p>}
      </form>
    </div>
  );
};

export default RegexForm;
