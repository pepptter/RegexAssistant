import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(credentials.email, credentials.password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Login failed");
    }
  };

  return (
    <div className="login container py-5">
      <h1 className="title mb-4">Login</h1>
      <form onSubmit={handleSubmit} noValidate className="login-form">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={credentials.email}
            onChange={handleChange}
            required
            className="form-control"
            autoComplete="username"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            required
            className="form-control"
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
      {error && <p className="error mt-3">{error}</p>}
    </div>
  );
};

export default Login;
