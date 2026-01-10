import { useState } from "react";
import { useGetitemQuery } from "../store/home";
import Commentpost from "./comment/commentpost";
import Postcomment from "./comment/postcomment";
import Likecreate from "./like/likecreate";
import { useNavigate, useSearchParams } from "react-router-dom";

import Searchp from "./filter/filter";
import Categoryfilter from "./filter/category";

function Postlist() {
  const [openCommentId, setOpenCommentId] = useState(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dropdown, setdropdown] = useState(false);

  // Read URL params every render
  const categoryParam = searchParams.get("category")?.split(",") || [];
  const searchParam = searchParams.get("search") || "";

  // RTK Query fetch
  const { data, error, isLoading } = useGetitemQuery({
    category: categoryParam,
    search: searchParam,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Secondary navbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white shadow-md rounded-xl p-4">
        {/* Category dropdown */}
        <div className="relative">
          <button
            onClick={() => setdropdown((prev) => !prev)}
            className="w-full text-m font-medium py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Category
          </button>
          {dropdown && (
            <div className="absolute top-full mt-2 z-50">
              <Categoryfilter />
            </div>
          )}
        </div>

        {/* Search bar */}
        <div className="flex-1">
          <Searchp />
        </div>
      </div>

      {/* Posts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <p className="col-span-full text-center text-gray-500">
            Loading posts...
          </p>
        )}

        {data &&
          data.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between"
            >
              <div>
                <h1 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h1>
                <p>{item.description.split(" ").slice(0, 5).join(" ")}...</p>

                <div className="flex items-center gap-3 mt-3">
                  <Likecreate id={item.id} />
                  <span className="text-sm text-gray-600">{item.like_count}</span>
                </div>

                <button
                  onClick={() =>
                    setOpenCommentId((prev) => (prev === item.id ? null : item.id))
                  }
                  className="mt-3 text-sm text-blue-600 hover:underline"
                >
                  {openCommentId === item.id ? "Hide comments" : "Show comments"}
                </button>

                {openCommentId === item.id && (
                  <div className="mt-3">
                    <Commentpost id={item.id} />
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-3">
                <Postcomment id={item.id} />
                <button
                  onClick={() => navigate(`/a/${item.id}`)}
                  className="w-full text-sm font-medium py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}

        {error?.data?.message && (
          <p className="col-span-full text-center text-red-600 text-sm">
            {error.data.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Postlist;
