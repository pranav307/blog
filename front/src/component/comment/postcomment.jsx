import { useState } from "react";
import { useCommentpostMutation } from "../../store/comment";

function Postcomment({ id, parent_id = null }) {
  const token = localStorage.getItem("access");
  const [content, setContent] = useState("");
  const [commentPost, { isLoading, error }] = useCommentpostMutation();

  const handleSubmit = async () => {
    if (!token) {
      alert("Login first");
      return;
    }

    if (!content.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const payload = {
        id, // post_id
        data: { content },
      };

      if (parent_id) {
        payload.parent_id = parent_id;
      }

      const res = await commentPost(payload).unwrap();
      console.log("Comment created:", res);
      setContent("");
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  return (
    <div className="mt-2 flex flex-col gap-2">
      <input
        type="text"
        placeholder={parent_id ? "Write a reply…" : "Write a comment…"}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="self-start px-4 py-2 bg-blue-600 text-white rounded-lg
                   hover:bg-blue-700 transition disabled:opacity-60
                   disabled:cursor-not-allowed"
      >
        {isLoading ? "Posting…" : "Submit"}
      </button>

      {error && (
        <p className="text-red-600 text-sm">
          Something went wrong
        </p>
      )}
    </div>
  );
}

export default Postcomment;
