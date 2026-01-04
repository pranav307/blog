import { useState } from "react";
import { useGetitemQuery } from "../store/home";
import Commentpost from "./comment/commentpost";
import Postcomment from "./comment/postcomment";
import Likecreate from "./like/likecreate";
import { useNavigate } from "react-router-dom";

function Postlist() {
  const [openCommentId, setOpenCommentId] = useState(null);
  const { data, error, isLoading } = useGetitemQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600 text-sm">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

                <div className="flex items-center gap-3 mt-3">
                  <Likecreate id={item.id} />
                  <span className="text-sm text-gray-600">
                    {item.like_count}
                  </span>
                </div>

                <button
                  onClick={() =>
                    setOpenCommentId((prev) =>
                      prev === item.id ? null : item.id
                    )
                  }
                  className="mt-3 text-sm text-blue-600 hover:underline"
                >
                  {openCommentId === item.id
                    ? "Hide comments"
                    : "Show comments"}
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
                  className="w-full text-sm font-medium py-2 rounded-lg
                             bg-blue-600 text-white hover:bg-blue-700 transition"
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
