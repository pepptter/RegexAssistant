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

  if (loading) return <p className="text-center my-3">Loading regex patterns...</p>;
  if (error)
    return (
      <p className="text-danger text-center my-3">
        {error}
      </p>
    );

  return (
    <div className="common-regex-list container py-4">
      {regexList.map((regex) => (
        <div key={regex.id} className="regex-card shadow-sm p-3 mb-4 mx-auto">
          <div className="regex-header d-flex justify-content-between align-items-center mb-2">
            <h5 className="regex-name mb-0">{regex.name}</h5>
            <code className="regex-pattern">{regex.pattern}</code>
          </div>
          <p className="regex-description">{regex.description}</p>

          {canSave && token && regex.userId === null && (
            <>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  setMessage(null);
                  handleSave(regex);
                }}
              >
                Save to My List
              </button>
              {message && (
                <p className="save-message text-success mt-2 fw-medium">
                  {message}
                </p>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommonRegexList;
