import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface RegexPattern {
  id: number;
  name: string;
  pattern: string;
  description: string;
  userId?: string | null;
}

const CommonRegexList = ({ canSave }: { canSave: boolean }) => {
  const { token } = useAuth();
  const [regexList, setRegexList] = useState<RegexPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegexes = async () => {
      const endpoint = token ? "/api/regex" : "/api/regex/public";

      try {
        const res = await fetch(endpoint, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) {
          throw new Error("Failed to fetch regex list");
        }

        const data = await res.json();
        setRegexList(data);
      } catch (err: any) {
        setError(err.message || "Error loading regex patterns");
      } finally {
        setLoading(false);
      }
    };

    fetchRegexes();
  }, [token]);

  const handleSave = async (pattern: RegexPattern) => {
    if (!token) return;

    const alreadySaved = regexList.some(
      (r) => r.name === pattern.name && r.userId !== null
    );
    if (alreadySaved) {
      setMessage("You already saved this regex.");
      return;
    }

    try {
      const res = await fetch("/api/regex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: pattern.name,
          pattern: pattern.pattern,
          description: pattern.description,
        }),
      });

      if (!res.ok) throw new Error("Failed to save regex");

      setMessage("Regex saved successfully!");
    } catch (err: any) {
      setMessage(err.message || "Could not save");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="common-regex-list">
      {regexList.map((regex) => (
        <div key={regex.id} className="regex-item">
          <strong>{regex.name}</strong>
          <code>{regex.pattern}</code>
          <p>{regex.description}</p>

          {canSave && token && regex.userId === null && (
            <>
              <button onClick={() => handleSave(regex)}>Save to My List</button>
              {message && <p style={{ color: "green" }}>{message}</p>}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommonRegexList;
