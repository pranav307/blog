import { useState } from "react"
import { useCommentpostMutation } from "../../store/comment"

function Postcomment({ id, parent_id = null }) {
  const token = localStorage.getItem("access")
  const [content, setContent] = useState("")
  const [commentPost, { isLoading, error }] = useCommentpostMutation()

  const handleSubmit = async () => {
    if (!token) {
      alert("Login first")
      return
    }

    if (!content.trim()) {
      alert("Comment empty nahi ho sakta")
      return
    }

    try {
      const payload = {
        id, // post_id
        data: { content },
      }

      // sirf tab bhejo jab reply ho
      if (parent_id) {
        payload.parent_id = parent_id
      }

      const res = await commentPost(payload).unwrap()
      console.log("comment created:", res)

      setContent("")
    } catch (err) {
      console.error("comment error:", err)
    }
  }

  return (
    <div style={{ marginTop: "8px" }}>
      <input
        type="text"
        placeholder={parent_id ? "Write a reply…" : "Write a comment…"}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Posting…" : "Submit"}
      </button>

      {error && <p style={{ color: "red" }}>Something went wrong</p>}
    </div>
  )
}

export default Postcomment
