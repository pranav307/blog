import { useEffect } from "react"
import { useLazyProfilegetQuery } from "../../store/apirtk"
import { useNavigate } from "react-router-dom"
function Profileget() {
  const [getProfile, { data, error, isLoading }] = useLazyProfilegetQuery();
  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    return <p>{error?.data?.message || "Error fetching profile"}</p>;
  }

  if (!data) return null;

  return (
    <div className=" mx-auto flex flex-col  items-center mt-24 max-w-2xl bg-gray-100 p-4">
      <h1 className="text-xl font-semibold">{data.display_name}</h1>

      <p className="text-gray-600">{data.bio}</p>

      <p>Email: {data.user?.email}</p>

      {data.location && <p>Location: {data.location}</p>}

      {data.website && (
        <a
          href={data.website}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500"
        >
          {data.website}
        </a>
      )}

      <div className="space-x-3">
        {data.twitter && <a href={data.twitter}>Twitter</a>}
        {data.linkedin && <a href={data.linkedin}>LinkedIn</a>}
        {data.github && <a href={data.github}>GitHub</a>}
      </div>

      {data.profile_image && (
        <img
          src={data.profile_image}
          alt="profile"
          className="w-24 h-24 rounded-full object-cover"
        />
      )}

      <button
        onClick={() => navigate("/pp")}
        className="mt-3 px-3 py-1 bg-blue-500 text-white"
      >
        Edit Profile
      </button>
    </div>
  );
}

export default Profileget;
