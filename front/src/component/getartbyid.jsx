import { useNavigate, useParams } from "react-router-dom";
import { useGetbyidQuery } from "../store/home";
import Commentpost from "./comment/commentpost";

function Articlebyid() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetbyidQuery(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600 text-sm">Loading article...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {data && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {data.title}
          </h1>

          <p className="text-gray-700 leading-relaxed mb-6">
            {data.description}
          </p>

          <div className="border-t pt-4">
            <Commentpost id={data.id} />
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 text-sm text-blue-600 hover:underline"
          >
            ← Back
          </button>
        </div>
      )}

      {error && (
        <p className="mt-4 text-center text-red-600 text-sm">
          Failed to load article
        </p>
      )}
    </div>
  );
}

export default Articlebyid;
