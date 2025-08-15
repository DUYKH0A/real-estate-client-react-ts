import React, { useEffect, useState } from "react";
import { deleteProperty, getProperties } from "../api/property";
import type { Property } from "../api/property";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/auth";
const PropertyList: React.FC = () => {
  const navigate = useNavigate(); 

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [sortField, setSortField] = useState("price");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchProperties = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getProperties({
        search,
        city,
        status,
        sortField,
        sortOrder,
        page,
      });
      setProperties(res.data.data);
      setLastPage(res.data.meta.last_page || 1);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data.message || "Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [search, city, status, sortField, sortOrder, page]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await deleteProperty(id, getToken() || "");
      fetchProperties();
    } catch (err) {
      console.error(err);
      alert("Failed to delete property");
    }
  };
  return (
    <div>
      <button onClick={() => navigate("/properties/create")}>
        Create Property
      </button>

      <h1>Property List</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
        </select>
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="price">Price</option>
          <option value="area">Area</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table
          border={1}
          cellPadding={5}
          style={{ width: "100%", textAlign: "left" }}
        >
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>City</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{p.price}</td>
                <td>{p.city}</td>
                <td>{p.status}</td>
                <td>
                  <button onClick={() => navigate(`/properties/${p.id}/edit`)}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: "1rem" }}>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span style={{ margin: "0 1rem" }}>{page}</span>
        <button disabled={page >= lastPage} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PropertyList;
