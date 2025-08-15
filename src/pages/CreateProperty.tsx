import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty } from "../api/property";
import { getToken } from "../utils/auth";
import type { AxiosError } from "axios";

const CreateProperty: React.FC = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [status, setStatus] = useState("available");
  const [images, setImages] = useState<FileList | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("area", area);
      formData.append("city", city);
      formData.append("district", district);
      formData.append("status", status);

      if (images) {
        Array.from(images).forEach((file) => {
          formData.append("images[]", file);
        });
      }

      await createProperty(formData, getToken() || "");
      navigate("/properties");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(
        axiosError.response?.data?.message || "Failed to create property"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Property</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="District"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
        </select>
        <input
          type="file"
          multiple
          onChange={(e) => setImages(e.target.files)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CreateProperty;
