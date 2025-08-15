import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProperty,
  updateProperty,
  type Property,
  type PropertyImage,
} from "../api/property";
import { getToken } from "../utils/auth";
import type { AxiosError } from "axios";

const EditProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [status, setStatus] = useState("available");
  const [images, setImages] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<PropertyImage[]>([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await getProperty(Number(id));
        const data: Property = res.data;

        setTitle(data.title || "");
        setPrice(data.price?.toString() || "");
        setArea(data.area?.toString() || "");
        setCity(data.city || "");
        setDistrict(data.district || "");
        setStatus(data.status || "available");

        if (Array.isArray(data.images)) {
          setExistingImages(data.images);
        }
      } catch (err: unknown) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(
          axiosError.response?.data?.message || "Failed to load property"
        );
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      if (title) formData.append("title", title);
      if (price) formData.append("price", price);
      if (area) formData.append("area", area);
      if (city) formData.append("city", city);
      if (district) formData.append("district", district);
      if (status) formData.append("status", status);

      if (images) {
        Array.from(images).forEach((file) => {
          formData.append("images[]", file);
        });
      }

      const token = getToken() || "";
      await updateProperty(Number(id), formData, token);
      navigate("/properties");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(
        axiosError.response?.data?.message || "Failed to update property"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Edit Property</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {existingImages.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Existing Images</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {existingImages.map((img) => (
              <img
                key={img.id}
                src={
                  img.image_path.startsWith("http")
                    ? img.image_path
                    : `http://real-estate-api-laravel.test/${img.image_path}`
                }
                // REACT_APP_API_URL
                alt="Property"
                style={{
                  width: "120px",
                  height: "80px",
                  objectFit: "cover",
                  border: img.is_primary ? "3px solid green" : "1px solid #ccc",
                }}
              />
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="District"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        />
        <br />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
        </select>
        <br />
        <input
          type="file"
          multiple
          onChange={(e) => setImages(e.target.files)}
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default EditProperty;
