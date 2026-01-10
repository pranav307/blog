import {useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetitemQuery } from "../../store/home";

const CATEGORIES = [
  { label: "News", value: "news" },
  { label: "Education", value: "edu" },
  { label: "Sports", value: "sports" },
  { label: "Technology", value: "tech" },
  { label: "Business", value: "business" },
  { label: "Health", value: "health" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Politics", value: "politics" },
  { label: "Travel", value: "travel" },
  { label: "Food", value: "food" },
  { label: "Lifestyle", value: "lifestyle" },
];

function Categoryfilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState([]);

  // Read initial state from URL on load
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setSelected(categoryFromUrl.split(","));
    }
  }, []);

  const handleChecked = (value) => {
    setSelected((prev) => {
      const updated = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];

      const newParams = new URLSearchParams(searchParams);
      if (updated.length > 0) {
        newParams.set("category", updated.join(","));
      } else {
        newParams.delete("category");
      }
      setSearchParams(newParams);

      return updated;
    });
  };

  const handleReset = () => {
    setSelected([]);
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="w-64 bg-white p-4 rounded-xl shadow h-32 overflow-scroll">
      <h2 className="font-semibold mb-3">Filter by Category</h2>

      <div className="flex flex-col gap-2 mb-3">
        {CATEGORIES.map((cat) => (
          <label key={cat.value} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(cat.value)}
              onChange={() => handleChecked(cat.value)}
              className="w-4 h-4"
            />
            {cat.label}
          </label>
        ))}
      </div>

      <button
        onClick={handleReset}
        className="w-full text-sm font-medium py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
      >
        Clear
      </button>
    </div>
  );
}

export default Categoryfilter