import { useState } from "react";
import Postcomment from "./postcomment";
import Commentpost from "./commentpost";

function CommentItem({ comment }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="ml-5 mt-4 border-l border-gray-300 pl-4">

      <h1>User:{comment.user_name}</h1>
      <p className="text-gray-800">{comment.content}</p>

      <small className="text-gray-500 text-sm">
        Replies: {comment.replies_count}
      </small>

      <div className="mt-2 flex flex-wrap gap-2">
        {comment.replies_count > 0 && (
          <button
            onClick={() => setShowReplies((prev) => !prev)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showReplies ? "Hide replies" : "Show replies"}
          </button>
        )}

        <button
          onClick={() => setShowReplyForm((prev) => !prev)}
          className="text-sm text-green-600 hover:underline"
        >
          Write reply
        </button>
      </div>

      {/* Reply form (only for real comments) */}
      {showReplyForm && !comment._optimistic && (
        <div className="mt-2">
          <Postcomment id={comment.post} parent_id={comment.id} />
        </div>
      )}

      {/* Nested replies */}
      {showReplies && (
        <div className="mt-2">
          <Commentpost id={comment.post} parent_id={comment.id} />
        </div>
      )}
    </div>
  );
}

export default CommentItem;
