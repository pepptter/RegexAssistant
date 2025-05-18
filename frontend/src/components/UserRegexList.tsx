// src/components/UserRegexList.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

type RegexPattern = {
  id: number;
  name: string;
  pattern: string;
  description: string;
  userId?: string;
};

const UserRegexList = () => {
  const { token } = useAuth();
  const [patterns, setPatterns] = useState<RegexPattern[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegexes = async () => {
      if (!token) return;

      try {
        const res = await fetch("https://localhost:7013/api/regex", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load regex patterns.");

        const data = await res.json();
        const userOnly = data.filter((r: RegexPattern) => r.userId !== null);
        setPatterns(userOnly);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      }
    };

    fetchRegexes();
  }, [token]);

  return (
    <div className="user-regex-list">
      <h2>Your Saved Regex Patterns</h2>
      {error && <p className="error">{error}</p>}
      {patterns.length === 0 ? (
        <p>You haven't saved any patterns yet.</p>
      ) : (
        <ul>
          {patterns.map((pattern) => (
            <li key={pattern.id}>
              <strong>{pattern.name}</strong>: <code>{pattern.pattern}</code>
              <p>{pattern.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserRegexList;
