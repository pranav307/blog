import { useNavigate, useParams } from "react-router-dom";
import { useArticledeleteMutation, useGetarticleQuery } from "../../store/article";
import Commentpost from "../comment/commentpost";

function Userarticlebyid() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetarticleQuery(id);
  const [articledelete, { error: err }] = useArticledeleteMutation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600 text-sm">Loading article...</p>
      </div>
    );
  }

  const handledelete = async (id) => {
    try {
      const res = await articledelete(id).unwrap();
      console.log("Deleted successfully", res.data);
    } catch (error) {
      console.log("Error deleting article:", err?.data?.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {data ? (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">{data.title}</h1>
          <p className="text-gray-700 leading-relaxed">{data.description}</p>

          <div className="border-t pt-4">
            <Commentpost id={data.id} />
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => navigate(`/img/${data.id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Upload Media
            </button>

            <button
              onClick={() => navigate(`/up/${data.id}`)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Update
            </button>

            <button
              onClick={() => handledelete(data.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-6">Nothing found</p>
      )}

      {error && (
        <p className="mt-4 text-center text-red-600 text-sm">
          Failed to load article
        </p>
      )}
    </div>
  );
}

export default Userarticlebyid;
