import { useState } from "react"
import Postcomment from "./postcomment"
import Commentpost from "./commentpost" // replies list component

function CommentItem({ comment }) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showReplies, setShowReplies] = useState(false)

  return (
    <div
      style={{
        marginLeft: "20px",
        borderLeft: "1px solid #ddd",
        paddingLeft: "10px",
      }}
    >
      <p>{comment.content}</p>

      <small>Replies: {comment.replies_count}</small>
      <br />

      {comment.replies_count > 0 && (
        <button onClick={() => setShowReplies((p) => !p)}>
          {showReplies ? "hide replies" : "show replies"}
        </button>
      )}

      <button onClick={() => setShowReplyForm((p) => !p)}>
        write reply
      </button>

      {/* reply form */}
      {showReplyForm && (
        <Postcomment id={comment.post} parent_id={comment.id} />
      )}

      {/* replies fetched lazily */}
      {showReplies && (
        <Commentpost id={comment.post} parent_id={comment.id} />
      )}
    </div>
  )
}

export default CommentItem
