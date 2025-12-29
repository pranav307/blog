import { useEffect, useState } from "react"
import { useLazyProfilegetQuery, useProfileMutation } from "../../store/apirtk"

function Profile() {
  const [updateProfile, { error, isLoading }] = useProfileMutation()
  const [getProfile, { data, isFetching }] = useLazyProfilegetQuery()

  const [prodata, setProData] = useState({
    display_name: "",
    bio: "",
    location: "",
    website: ""
  })

  // 🔥 fetch profile on mount
  useEffect(() => {
    getProfile()
  }, [getProfile])

  // 🔥 fill form when data arrives
  useEffect(() => {
    if (data) {
      setProData({
        display_name: data.display_name || "",
        bio: data.bio || "",
        location: data.location || "",
        website: data.website || ""
      })
    }
  }, [data])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      await updateProfile(prodata).unwrap()
      console.log("Profile updated successfully")
    } catch (err) {
      console.log("Update failed:", err)
    }
  }

  return (
    <div>
      {isFetching && <p>Loading profile...</p>}

      <label>
        Display Name
        <input
          type="text"
          name="display_name"
          value={prodata.display_name}
          onChange={handleChange}
        />
      </label>

      <label>
        Bio
        <textarea
          name="bio"
          value={prodata.bio}
          onChange={handleChange}
        />
      </label>

      <label>
        Location
        <input
          type="text"
          name="location"
          value={prodata.location}
          onChange={handleChange}
        />
      </label>

      <label>
        Website
        <input
          type="url"
          name="website"
          value={prodata.website}
          onChange={handleChange}
        />
      </label>

      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Saving..." : "Submit"}
      </button>

      {error && <p>{error?.data?.message || "Something went wrong"}</p>}
    </div>
  )
}

export default Profile
