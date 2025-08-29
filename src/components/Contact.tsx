import React, { useEffect, useState } from "react";
import { createItem, getBoardColumns } from "../Mondayapi";

interface Column {
  id: string;
  title: string;
  type: string;
}

const Contact: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch board columns dynamically
  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const cols = await getBoardColumns();
        setColumns(cols);
        // Initialize empty form data
        const initialData: Record<string, string> = {};
        cols.forEach((col) => (initialData[col.id] = ""));
        setFormData(initialData);
      } catch (err) {
        console.error("Error fetching columns", err);
        setError("Failed to load form fields");
      }
    };
    fetchColumns();
  }, []);

  // Handle input change
  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Submit form to Monday
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createItem(formData);
      setSuccess(true);
      setFormData(Object.fromEntries(columns.map((c) => [c.id, ""])));
    } catch (err) {
      console.error("Create item failed", err);
      setError("Create item failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Contact Form</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">Item created successfully!</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {columns.map((col) => (
          <div key={col.id}>
            <label className="block text-sm font-medium mb-1">{col.title}</label>
            <input
              type="text"
              value={formData[col.id] || ""}
              onChange={(e) => handleChange(col.id, e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder={`Enter ${col.title}`}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Contact;
