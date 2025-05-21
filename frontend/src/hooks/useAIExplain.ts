import { useState } from "react";
import { getAIExplanation } from "../components/utils/AI";

interface RegexPattern {
  id: number;
  name: string;
  pattern: string;
}

const useAIExplain = () => {
  const [selectedPattern, setSelectedPattern] = useState<RegexPattern | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExplain = async (pattern: RegexPattern) => {
    setSelectedPattern(pattern);
    setExplanation(null);
    setLoading(true);

    try {
      const prompt = `Explain what this regex means: ${pattern.pattern}`;
      const result = await getAIExplanation(prompt);
      setExplanation(result);
    } catch (error) {
      console.error("AI explanation error:", error);
      setExplanation("Unable to explain this regex.");
    } finally {
      setLoading(false);
    }
  };

  const closePanel = () => {
    setSelectedPattern(null);
    setExplanation(null);
  };

  return { selectedPattern, explanation, loading, handleExplain, closePanel };
};

export default useAIExplain;
