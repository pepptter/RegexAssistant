import { useState } from "react";
import { getAIExplanation } from "./AI";

export function useAIExplain() {
  const [selectedPattern, setSelectedPattern] = useState<any | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const explain = async (pattern: any) => {
    setSelectedPattern(pattern);
    setExplanation(null);
    setLoading(true);

    try {
      const prompt = `Explain what this regex means: ${pattern.pattern}`;
      const result = await getAIExplanation(prompt);
      setExplanation(result);
    } catch {
      setExplanation("Failed to fetch explanation.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedPattern(null);
    setExplanation(null);
  };

  return {
    selectedPattern,
    explanation,
    loading,
    explain,
    reset,
  };
}
