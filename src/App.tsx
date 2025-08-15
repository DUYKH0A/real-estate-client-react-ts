import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { isAuthenticated } from "./utils/auth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyList from "./pages/PropertyList";
import CreateProperty from "./pages/CreateProperty";
import EditProperty from "./pages/EditProperty";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated() ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/properties"
          element={
            isAuthenticated() ? <PropertyList /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/properties/create"
          element={
            isAuthenticated() ? <CreateProperty /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/properties/:id/edit"
          element={
            isAuthenticated() ? <EditProperty /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
