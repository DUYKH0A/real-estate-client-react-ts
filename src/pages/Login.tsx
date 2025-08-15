import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/api";
import { isAuthenticated, setToken } from "../utils/auth";
import type { AxiosError } from "axios";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      setToken(res.data.token);
      console.log("Token lưu rồi:", localStorage.getItem("token"));
      console.log("isAuthenticated?", isAuthenticated());

      navigate("/properties");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data.message || "Login failed");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
