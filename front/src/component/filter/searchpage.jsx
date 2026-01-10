import { useLocation, useNavigate } from "react-router-dom";

function Searchpage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const search = state?.search;
  const results = state?.results;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6">Search results for: <span className="text-blue-600">{search}</span></h2>

      {results?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition"
            >
              <div>
                <h1 className="text-lg font-semibold text-gray-800">{item.title}</h1>
                <p className="text-gray-600 mt-2">{item.description}</p>
              </div>

              <button
                onClick={() => navigate(`/a/${item.id}`)}
                className="mt-4 w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No results found for "{search}"</p>
      )}
    </div>
  );
}

export default Searchpage;
