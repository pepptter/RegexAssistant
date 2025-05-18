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

    const regexData: RegexData = {
      name: name.trim(),
      pattern: pattern.trim(),
      description: description.trim(),
    };

    onSubmit?.(regexData);

    setName("");
    setPattern("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="regex-form">
      <h3>Add a Regex Pattern</h3>

      <input
        type="text"
        placeholder="Pattern Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="regex-input"
      />

      <input
        type="text"
        placeholder="Regex Pattern"
        value={pattern}
        onChange={(e) => setPattern(e.target.value)}
        className="regex-input"
      />

      <textarea
        placeholder="Optional Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="regex-textarea"
      />

      <button type="submit" className="regex-button">
        Save Pattern
      </button>

      {error && <p className="regex-error">{error}</p>}
    </form>
  );
};

export default RegexForm;
