import { useState } from "react"
import Postcomment from "./postcomment"
import Commentpost from "./commentpost"

function CommentItem({ comment }) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showReplies, setShowReplies] = useState(false)

  return (
    <div
      style={{
        marginLeft: "20px",
        borderLeft: "1px solid #ddd",
        paddingLeft: "10px",
        marginTop: "10px",
      }}
    >
      <p>{comment.content}</p>

      <small>Replies: {comment.replies_count}</small>
      <br />

      {comment.replies_count > 0 && (
        <button onClick={() => setShowReplies((prev) => !prev)}>
          {showReplies ? "Hide replies" : "Show replies"}
        </button>
      )}

      <button onClick={() => setShowReplyForm((prev) => !prev)}>
        Write reply
      </button>

      {/* Reply form (sirf real comments ke liye) */}
      {showReplyForm && !comment._optimistic && (
        <Postcomment
          id={comment.post}
          parent_id={comment.id}
        />
      )}

      {/* Nested replies */}
      {showReplies && (
        <Commentpost
          id={comment.post}
          parent_id={comment.id}
        />
      )}
    </div>
  )
}

export default CommentItem
