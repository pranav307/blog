import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetitemQuery } from "../../store/home";

function Searchp() {
  const [searchquery, setsearch] = useState("");
  const [debounce, setdebounce] = useState(searchquery);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read initial search from URL
  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    setsearch(searchFromUrl);
    setdebounce(searchFromUrl);
  }, []);

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setdebounce(searchquery);

      // Update URL param
      const newParams = new URLSearchParams(searchParams);
      if (searchquery) {
        newParams.set("search", searchquery);
      } else {
        newParams.delete("search");
      }
      setSearchParams(newParams);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchquery]);

  // Get category from URL for RTK Query
  const categoryParam = searchParams.get("category")?.split(",") || [];

  const { data, isLoading, error } = useGetitemQuery({
    category: categoryParam,
    search: debounce,
  });

  return (
    <div className="w-full flex flex-col items-center gap-4 mt-6">
      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-2xl shadow-md">
        <input
          type="text"
          value={searchquery}
          onChange={(e) => setsearch(e.target.value)}
          placeholder="Search item..."
          className="w-64 px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={() =>
            navigate("/searchpage", {
              state: { search: debounce, results: data },
            })
          }
          className="px-5 py-2 bg-green-500 text-white font-medium rounded-2xl hover:bg-green-600 transition"
        >
          Search
        </button>
        <button
          onClick={() => setsearch("")}
          className="px-5 py-2 bg-red-500 text-white font-medium rounded-2xl hover:bg-red-600 transition"
        >
          Clear
        </button>
      </div>

      {/* Status */}
      {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-500">Something went wrong</p>}

      {/* Result Preview */}
      {/* <div className="w-full max-w-md flex flex-col gap-2">
        {data?.map((item) => (
          <div
            key={item.id}
            className="bg-gray-100 px-4 py-2 rounded-xl shadow-sm hover:bg-gray-200 transition"
          >
            {item.title}
          </div>
        ))}
      </div> */}
    </div>
  );
}

export default Searchp