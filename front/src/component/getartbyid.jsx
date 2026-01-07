import { useNavigate, useParams } from "react-router-dom";
import { useGetbyidQuery } from "../store/home";
import Commentpost from "./comment/commentpost";
import Postcomment from "./comment/postcomment";
import { useState } from "react";

function Articlebyid() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openCommentId, setOpenCommentId] = useState(false);
  const { data, error, isLoading } = useGetbyidQuery(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600 text-sm">Loading article...</p>
      </div>
    );
  }

  if (error) {
    return (
      <p className="mt-4 text-center text-red-600 text-sm">
        Failed to load article
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {data && (
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {data.title}
          </h1>

          {/* Meta info */}
          <div className="text-sm text-gray-500 mb-4 flex flex-wrap gap-3">
            <span>Category: {data.category}</span>
            <span>Likes: {data.like_count}</span>
            <span>
              Posted on: {new Date(data.created_at).toLocaleDateString()}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed mb-6">
            {data.description}
          </p>

          {/* External links */}
          {(data.link1 || data.link2) && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Related links
              </h3>

              <ul className="list-disc ml-5 text-sm text-blue-600">
                {data.link1 && (
                  <li>
                    <a
                      href={data.link1}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {data.link1}
                    </a>
                  </li>
                )}

                {data.link2 && (
                  <li>
                    <a
                      href={data.link2}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {data.link2}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Media (images/videos) */}
          {data.media?.length > 0 && (
            <div className="mb-6 grid grid-cols-1 gap-4">
              {data.media.map((mediaId) => (
                <div key={mediaId} className="bg-gray-100 rounded-md p-2">
                  Media ID: {mediaId}
                </div>
              ))}
            </div>
          )}
           {/* Comments */}
          <div className="border-t pt-4">
            <Postcomment id={data.id} />
          </div>
          {/* Commentslist */}
          <button onClick={()=>setOpenCommentId(prev=>!prev)}
            className="p-2 text-blue-400"
            >{openCommentId ? "hide comment" :"Show comments"} </button>
          {openCommentId && <div className="border-t pt-4 transform transition ease-out 2s">
            <Commentpost id={data.id} />
          </div> }
          

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="mt-6 text-sm text-blue-600 hover:underline"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}

export default Articlebyid;
