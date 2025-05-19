import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

type RegexPattern = {
  id: number;
  name: string;
  pattern: string;
  description: string;
  userId?: string | null;
};

const UserRegexList = () => {
  const { token } = useAuth();
  const [patterns, setPatterns] = useState<RegexPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchUserRegexes = async () => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchUserRegexes();
  }, [token]);

  if (loading) return <p>Loading your saved regex patterns...</p>;
  if (error)
    return (
      <p className="text-danger text-center my-3">
        {error}
      </p>
    );

  if (patterns.length === 0) {
    return <p className="text-center my-3">You haven't saved any patterns yet.</p>;
  }

  return (
    <div className="user-regex-list container py-4">
      <h2 className="mb-4 text-primary">Your Saved Regex Patterns</h2>
      <ul className="list-group">
        {patterns.map(({ id, name, pattern, description }) => (
          <li key={id} className="list-group-item mb-3">
            <strong className="d-block mb-1">{name}</strong>
            <code className="d-block mb-2">{pattern}</code>
            <p className="mb-0 text-muted fst-italic">{description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserRegexList;
