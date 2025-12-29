import { useEffect } from "react"
import { useLazyProfilegetQuery } from "../../store/apirtk"

function Profileget() {
  const [getProfile, { data, error, isLoading }] = useLazyProfilegetQuery()

  useEffect(() => {
    getProfile()
  }, [getProfile])

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <>
      {data && (
        <div>
          <h1>{data.display_name}</h1>
          <h2>{data.user?.username}</h2>
        </div>
      )}

      {error && <p>{error?.data?.message || "Error fetching profile"}</p>}
    </>
  )
}

export default Profileget
