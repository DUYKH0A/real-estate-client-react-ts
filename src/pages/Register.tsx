import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/api";
import { AxiosError } from "axios";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      await register(name, email, password, passwordConfirm);
      navigate("/login");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data.message || "Registration failed");
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm Password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{color: "red"}}>{error}</p>}
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;
