import { useEffect, useState } from "react";
import {
  useLazyProfilegetQuery,
  useProfileMutation
} from "../../store/apirtk";

function Profile() {
  const [updateProfile, { error, isLoading }] = useProfileMutation();
  const [getProfile, { data, isFetching }] = useLazyProfilegetQuery();

  const [prodata, setProData] = useState({
    display_name: "",
    bio: "",
    location: "",
    website: "",
    twitter: "",
    linkedin: "",
    github: "",
    profile_image: null
  });

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (data) {
      setProData({
        display_name: data.display_name || "",
        bio: data.bio || "",
        location: data.location || "",
        website: data.website || "",
        twitter: data.twitter || "",
        linkedin: data.linkedin || "",
        github: data.github || "",
        profile_image: null
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(prodata).forEach(([k, v]) => v && formData.append(k, v));

    try {
      await updateProfile(formData).unwrap();
      alert("Profile updated");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-2xl rounded-lg bg-white p-6 shadow">
      <h1 className="mb-6 text-xl font-semibold">Edit Profile</h1>

      {isFetching && <p className="text-sm text-gray-500">Loading…</p>}

      <div className="space-y-4 flex flex-col">

        <div>
          <label className="block text-sm font-medium">Display Name</label>
          <input
            name="display_name"
            value={prodata.display_name}
            onChange={handleChange}
            className="mt-1 w-full rounded border px-3 py-2 focus:outline-none focus:ring"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Bio</label>
          <textarea
            name="bio"
            value={prodata.bio}
            onChange={handleChange}
            rows={4}
            className="mt-1 w-full rounded border px-3 py-2 focus:outline-none focus:ring"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            name="location"
            value={prodata.location}
            onChange={handleChange}
            className="mt-1 w-full rounded border px-3 py-2 focus:outline-none focus:ring"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Website</label>
          <input
            name="website"
            value={prodata.website}
            onChange={handleChange}
            className="mt-1 w-full rounded border px-3 py-2 focus:outline-none focus:ring"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Twitter</label>
          <input
            name="twitter"
            value={prodata.twitter}
            onChange={handleChange}
            className="mt-1 w-full rounded border px-3 py-2 focus:outline-none focus:ring"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">LinkedIn</label>
          <input
            name="linkedin"
            value={prodata.linkedin}
            onChange={handleChange}
            className="mt-1 w-full rounded border px-3 py-2 focus:outline-none focus:ring"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">GitHub</label>
          <input
            name="github"
            value={prodata.github}
            onChange={handleChange}
            className="mt-1 w-full rounded border px-3 py-2 focus:outline-none focus:ring"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Profile Image</label>
          <input
            type="file"
            name="profile_image"
            onChange={handleChange}
            className="mt-1 w-full text-sm"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Saving…" : "Save Changes"}
        </button>

        {error && (
          <p className="text-sm text-red-500">
            {error?.data?.message || "Update failed"}
          </p>
        )}
      </div>
    </div>
  );
}

export default Profile;
