import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
