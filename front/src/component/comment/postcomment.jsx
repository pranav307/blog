import { useState } from "react"
import { useCommentpostMutation } from "../../store/comment"

function Postcomment({ id, parent_id = null }) {
  const token = localStorage.getItem("access")
  const [content, setContent] = useState("")
  const [postdata, { error, isLoading }] = useCommentpostMutation()

  const handleSubmit = async () => {
    if (!token) {
      alert("login first")
      return
    }

    try {
      const res = await postdata({
        id,
        parent_id,
        data: {
          content: content
        }
      }).unwrap()

      console.log("comment created", res)
      setContent("")
    } catch (err) {
      console.error("error", err)
    }
  }

  return (
    <div>
      <label>write comment</label>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={isLoading}>
        Submit
      </button>

      {error && <p>Something went wrong</p>}
    </div>
  )
}

export default Postcomment
