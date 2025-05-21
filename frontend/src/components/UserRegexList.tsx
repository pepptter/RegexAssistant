import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface RegexPattern {
  id: number;
  name: string;
  pattern: string;
  description: string;
}

const UserRegexList: React.FC = () => {
  const [patterns, setPatterns] = useState<RegexPattern[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchUserPatterns = async () => {
      try {
        const res = await fetch("https://localhost:7013/api/regex", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user patterns");
        const data: RegexPattern[] = await res.json();
        setPatterns(data);
      } catch (err) {
        console.error("Error fetching user patterns:", err);
      }
    };

    fetchUserPatterns();
  }, [token]);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`https://localhost:7013/api/regex/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Could not delete pattern.");
      setPatterns((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="user-regex-list">
      <h2>My Saved Regexes</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Pattern</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patterns.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td><code>{p.pattern}</code></td>
                <td>{p.description}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserRegexList;
