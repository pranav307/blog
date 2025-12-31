import Postcomment from "./postcomment";

function CommentItem({ comment }) {
  return (
    <div style={{ marginLeft: "20px", borderLeft: "1px solid #ddd", paddingLeft: "10px" }}>
      <p>{comment.content}</p>
      <small>Replies: {comment.replies_count}</small>
      <button onClick={()=><Postcomment id={comment.post} parent_d={comment.id}></Postcomment>}>comment</button>

      {/* Render replies directly */}
      {comment.replies && comment.replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} />
      ))}
    </div>
  );
}

export default CommentItem;