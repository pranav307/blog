import { useNavigate } from "react-router-dom";
import { useArticledeleteMutation, useGetuserpostlistQuery } from "../../store/article";
import Commentpost from "../comment/commentpost";

function Userarticlelist() {
  const { data, error, isLoading } = useGetuserpostlistQuery();
  const [articledelete, { error: ed }] = useArticledeleteMutation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600 text-sm">Loading your articles...</p>
      </div>
    );
  }

  const handledelete = async (id) => {
    try {
      const res = await articledelete(id).unwrap();
      console.log("Deleted successfully", res.data);
    } catch (error) {
      console.log("Error deleting article:", ed?.data?.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {data && data.length > 0 ? (
        data.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md p-6 space-y-4"
          >
            <h1 className="text-xl font-bold text-gray-800">{item.title}</h1>

            <div className="border-t pt-4">
              <Commentpost id={item.id} />
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={() => navigate(`/article/${item.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Details
              </button>

              <button
                onClick={() => navigate(`/up/${item.id}`)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Edit
              </button>

              <button
                onClick={() => handledelete(item.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">No articles found</p>
      )}

      {error && (
        <p className="text-center text-red-600 text-sm mt-4">
          Failed to load articles
        </p>
      )}
    </div>
  );
}

export default Userarticlelist;
