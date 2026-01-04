import { useEffect } from "react"
import { useLazyProfilegetQuery } from "../../store/apirtk"
import { useNavigate } from "react-router-dom"

function Profileget() {
  const [getProfile, { data, error, isLoading }] = useLazyProfilegetQuery()
  const navigate =useNavigate()
  useEffect(() => {
    getProfile()
  }, [getProfile])

  if (isLoading) {
    return <p>Loading...</p>
  }

  console.log(data,"pk")

  return (
    <>
      {data && (
        <div>
          <h1>{data.display_name}</h1>
          <h2>{data.user?.email}</h2>
          <button onClick={()=>navigate("/pp")}>Edit</button>
        </div>
      )}

      {error && <p>{error?.data?.message || "Error fetching profile"}</p>}
    </>
  )
}

export default Profileget
