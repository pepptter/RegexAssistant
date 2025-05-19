import { useState } from "react";

const AIComponent = () => {
  const [mode, setMode] = useState("explain");
  const [regex, setRegex] = useState("");
  const [description, setDescription] = useState("");
  const [testString, setTestString] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildPrompt = () => {
    switch (mode) {
      case "explain":
        return `Explain what this regex means: ${regex}`;
      case "generate":
        return `Write a regular expression that matches: ${description}`;
      case "optimize":
        return `Can you simplify or optimize this regex: ${regex}`;
      case "test":
        return `Does the regex "${regex}" match the string "${testString}"? Explain.`;
      default:
        return "";
    }
  };

  const handleSend = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: buildPrompt(),
            },
          ],
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch response from OpenAI");

      const data = await res.json();
      setResponse(data.choices?.[0]?.message?.content || "No response.");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-container">
      <h2 className="ai-title">Regex AI Assistant</h2>

      <label htmlFor="mode" className="form-label">
        Select function:
      </label>
      <select
        id="mode"
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="form-select mb-3"
      >
        <option value="explain">Explain Regex</option>
        <option value="generate">Generate Regex from Description</option>
        <option value="optimize">Optimize Regex</option>
        <option value="test">Test Regex Against String</option>
      </select>

      {(mode === "explain" || mode === "optimize" || mode === "test") && (
        <input
          type="text"
          placeholder="Enter regex"
          value={regex}
          onChange={(e) => setRegex(e.target.value)}
          className="form-control mb-3"
        />
      )}

      {mode === "generate" && (
        <input
          type="text"
          placeholder="Describe what you want to match"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control mb-3"
        />
      )}

      {mode === "test" && (
        <input
          type="text"
          placeholder="Enter a test string"
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="form-control mb-3"
        />
      )}

      <button
        onClick={handleSend}
        disabled={loading}
        className="btn btn-primary w-100"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {error && <p className="text-danger mt-3">{error}</p>}
      {response && <div className="ai-response mt-3 p-3 border rounded bg-light">{response}</div>}
    </div>
  );
};

export default AIComponent;
