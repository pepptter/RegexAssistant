import type { JSX } from "react";
import React from "react";


export async function getAIExplanation(prompt: string): Promise<string> {
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

  if (!res.ok) throw new Error("Failed to fetch explanation from OpenAI");

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No explanation returned.";
}
export function formatExplanation(text: string): JSX.Element {
  const keywords = [
    "regex", "regular expression", "pattern", "string", "digit", "hyphen",
    "start", "end", "format", "match", "date", "characters", "symbol"
  ];

  const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");

  const lines = text.split("\n");

  return (
    <>
      {lines.map((line, index) => {
        const parts = line.split(regex);
        return (
          <React.Fragment key={index}>
            {parts.map((part, i) =>
              regex.test(part) ? (
                <strong key={i}>{part}</strong>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
            <br />
          </React.Fragment>
        );
      })}
    </>
  );
}
