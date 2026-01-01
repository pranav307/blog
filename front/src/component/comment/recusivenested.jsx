import { useState } from "react";
import Postcomment from "./postcomment";

function CommentItem({ comment }) {
  const [showReply, setShowReply] = useState(false)
  return (
    <div style={{ marginLeft: "20px", borderLeft: "1px solid #ddd", paddingLeft: "10px" }}>
      <p>{comment.content}</p>
      <small>Replies: {comment.replies_count}</small>
      <button onClick={()=>setShowReply(prev=>!prev)}>write reply</button>
       {showReply && (
        <Postcomment
          id={comment.post}
          parent_id={comment.id}
        />
      )}
      {/* Render replies directly */}
      {comment.replies && comment.replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} />
      ))}
    </div>
  );
}

export default CommentItem;