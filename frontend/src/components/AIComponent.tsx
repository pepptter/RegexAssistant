import { useState } from "react";
import { formatExplanation } from "./utils/AI";
import { useAuth } from "../context/AuthContext";
import { showToast } from "./utils/toast";

const AIComponent = () => {
  const [mode, setMode] = useState("explain");
  const [regex, setRegex] = useState("");
  const [description, setDescription] = useState("");
  const [testString, setTestString] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'sv'>('en');
  const { token } = useAuth();

  const labels = {
    en: {
      explain: "Explain Regex",
      generate: "Generate Regex from Description",
      optimize: "Optimize Regex",
      test: "Test Regex Against String",
      validate: "Validate Regex",
      extractData: "Extract Data from URL",
      checkMistakes: "Check Regex Mistakes",
      jsonExtract: "Extract JSON from Text",
      toggleLanguage: "Switch to Swedish",
    },
    sv: {
      explain: "Förklara Regex",
      generate: "Generera Regex från beskrivning",
      optimize: "Optimera Regex",
      test: "Testa Regex mot Sträng",
      validate: "Validera Regex",
      extractData: "Extrahera Data från URL",
      checkMistakes: "Kolla Regex Fel",
      jsonExtract: "Extrahera JSON från Text",
      toggleLanguage: "Byt till engelska",
    },
  };

  const buildPrompt = () => {
    switch (mode) {
      case "explain":
        return language === 'en'
          ? `Explain what this regex means: ${regex}`
          : `Förklara vad detta regex betyder: ${regex}`;
      case "generate":
        return language === 'en'
          ? `Write a regular expression that matches: ${description}`
          : `Skriv ett reguljärt uttryck som matchar: ${description}`;
      case "optimize":
        return language === 'en'
          ? `Can you simplify or optimize this regex: ${regex}`
          : `Kan du förenkla eller optimera detta regex: ${regex}`;
      case "test":
        return language === 'en'
          ? `Does the regex "${regex}" match the string "${testString}"? Explain.`
          : `Matchar regexet "${regex}" strängen "${testString}"? Förklara.`;
      case "validate":
        return language === 'en'
          ? `Is the regular expression ${regex} valid?`
          : `Är reguljära uttrycket ${regex} giltigt?`;
      case "extractData":
        return language === 'en'
          ? `Write a regex that extracts the domain name from a URL.`
          : `Skriv ett regex som extraherar domännamnet från en URL.`;
      case "checkMistakes":
        return language === 'en'
          ? `Does the regex ${regex} overly complicated for validating a strong password?`
          : `Är regexet ${regex} för komplicerat för att validera ett starkt lösenord?`;
      case "jsonExtract":
        return language === 'en'
          ? `Write a regex to extract JSON objects from a text string.`
          : `Skriv ett regex som extraherar JSON-objekt från en textsträng.`;
      default:
        return "";
    }
  };

const handleSend = async () => {
  setLoading(true);
  setResponse(null);
  setError(null);

  const prompt = buildPrompt();
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
            content: prompt,
          },
        ],
      }),
    });

    if (!res.ok) throw new Error("Failed to fetch response from OpenAI");

    const data = await res.json();
    const answer = data.choices?.[0]?.message?.content || "No response.";
    setResponse(answer);
  } catch (err: any) {
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};
const handleSaveQuestion = async () => {
  if (!token || !response) return;

  const prompt = buildPrompt();
  const userInput = mode === "generate" ? description : regex || testString;

  try {
    const res = await fetch("https://localhost:7013/api/aiquestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mode,
        input: userInput,
        prompt,
        response,
      }),
    });

    if (!res.ok) throw new Error("Could not save the question.");
      showToast("Question saved!");  } catch (err: any) {
    console.error(err);
      showToast("Failed to save question.");
  }
};



  return (
    <div className="ai-container">
      <h2 className="ai-title" style={{ color: '$color-primary' }}>Regex AI Assistant</h2>

      <div className="language-toggle mb-3">
        <button
          onClick={() => setLanguage(language === 'en' ? 'sv' : 'en')}
          className="btn btn-gray"
        >
          {language === 'en' ? labels.en.toggleLanguage : labels.sv.toggleLanguage}
        </button>
      </div>

      <label htmlFor="mode" className="form-label">
        Select function:
      </label>
      <select
        id="mode"
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="form-select mb-3"
        style={{ color: '$color-dark' }}
      >
        <option value="explain">{language === 'en' ? labels.en.explain : labels.sv.explain}</option>
        <option value="generate">{language === 'en' ? labels.en.generate : labels.sv.generate}</option>
        <option value="optimize">{language === 'en' ? labels.en.optimize : labels.sv.optimize}</option>
        <option value="test">{language === 'en' ? labels.en.test : labels.sv.test}</option>
        <option value="validate">{language === 'en' ? labels.en.validate : labels.sv.validate}</option>
        <option value="extractData">{language === 'en' ? labels.en.extractData : labels.sv.extractData}</option>
        <option value="checkMistakes">{language === 'en' ? labels.en.checkMistakes : labels.sv.checkMistakes}</option>
        <option value="jsonExtract">{language === 'en' ? labels.en.jsonExtract : labels.sv.jsonExtract}</option>
      </select>

      <div className="explanation-row mb-3" style={{ color: '$color-secondary' }}>
        <p>
          {mode === "explain" && (language === 'en' ? "Enter a regex pattern and ask AI to explain it." : "Ange ett regex-mönster och be AI att förklara det.")}
          {mode === "generate" && (language === 'en' ? "Provide a description, and AI will generate a regex for it." : "Ge en beskrivning, så genererar AI ett regex för det.")}
          {mode === "optimize" && (language === 'en' ? "Provide a regex, and AI will attempt to simplify or optimize it." : "Ge ett regex, och AI kommer att försöka förenkla eller optimera det.")}
          {mode === "test" && (language === 'en' ? "Enter a regex and test string to see if they match." : "Ange ett regex och en teststräng för att se om de matchar.")}
          {mode === "validate" && (language === 'en' ? "Check if your regex is valid." : "Kontrollera om ditt regex är giltigt.")}
          {mode === "extractData" && (language === 'en' ? "Write a regex to extract data, like a domain name from a URL." : "Skriv ett regex för att extrahera data, som domännamn från en URL.")}
          {mode === "checkMistakes" && (language === 'en' ? "Check if your regex is overly complicated for a task." : "Kontrollera om ditt regex är för komplicerat för en uppgift.")}
          {mode === "jsonExtract" && (language === 'en' ? "Write a regex to extract JSON objects from a text string." : "Skriv ett regex för att extrahera JSON-objekt från en textsträng.")}
        </p>
      </div>

      {(mode === "explain" || mode === "optimize" || mode === "test" || mode === "validate" || mode === "checkMistakes") && (
        <input
          type="text"
          placeholder={language === 'en' ? "Enter regex" : "Ange regex"}
          value={regex}
          onChange={(e) => setRegex(e.target.value)}
          className="form-control mb-3"
          style={{ borderColor: '$color-gray' }}
        />
      )}

      {mode === "generate" && (
        <input
          type="text"
          placeholder={language === 'en' ? "Describe what you want to match" : "Beskriv vad du vill matcha"}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control mb-3"
          style={{ borderColor: '$color-gray' }}
        />
      )}

      {mode === "test" && (
        <input
          type="text"
          placeholder={language === 'en' ? "Enter a test string" : "Ange en teststräng"}
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="form-control mb-3"
          style={{ borderColor: '$color-gray' }}
        />
      )}

      {mode === "extractData" && (
        <input
          type="text"
          placeholder={language === 'en' ? "Enter a URL" : "Ange en URL"}
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="form-control mb-3"
          style={{ borderColor: '$color-gray' }}
        />
      )}

      {mode === "jsonExtract" && (
        <input
          type="text"
          placeholder={language === 'en' ? "Enter the text to extract JSON from" : "Ange texten för att extrahera JSON"}
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="form-control mb-3"
          style={{ borderColor: '$color-gray' }}
        />
      )}

      <button
        onClick={handleSend}
        disabled={loading}
        className="btn btn-gray w-100"
      >
        {loading ? (language === 'en' ? "Thinking..." : "Tänker...") : (language === 'en' ? "Ask AI" : "Fråga AI")}
      </button>

      {error && <p className="text-danger mt-3">{error}</p>}
      {response && (
        <div className="ai-response mt-3 p-3 border rounded bg-light">
          {formatExplanation(response)}
          <button className="btn btn-gray mt-3" onClick={handleSaveQuestion}>
            Save this question
          </button>
        </div>
      )}


    </div>
  );
};

export default AIComponent;
