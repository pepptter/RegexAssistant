export interface RegexPattern {
  id?: number;
  pattern: string;
  description?: string;
  isGlobal?: boolean;
}

const baseUrl = "https://localhost:7013/api/regex";

export const getRegexPatterns = async (token: string): Promise<RegexPattern[]> => {
  const response = await fetch(baseUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch regex patterns");
  return await response.json();
};

export const saveRegexPattern = async (pattern: RegexPattern, token: string) => {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(pattern),
  });
  if (!response.ok) throw new Error("Failed to save pattern");
  return await response.json();
};

export async function deleteRegex(id: number, token: string): Promise<void> {
  const response = await fetch(`https://localhost:7013/api/regex/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete regex");
  }
}
