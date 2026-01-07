import { useEffect, useRef, useState } from "react";
import { useGetcommentQuery } from "../../store/comment";
import CommentItem from "./recusivenested";

function Commentpost({ id, parent_id }) {
  const [page, setPage] = useState(1);
  const [comments, setComments] = useState([]);

  const loaderRef = useRef(null);
  const loadingRef = useRef(false);

  const { data, isFetching } = useGetcommentQuery({ id, page, parent_id });

  const hasNextPage = Boolean(data?.next);

  // Reset when post or parent changes
  useEffect(() => {
    setPage(1);
    setComments([]);
  }, [id, parent_id]);

  // Append new page data
  useEffect(() => {
    if (data?.results) {
      setComments((prev) => {
        const newOnes = data.results.filter(
          (c) => !prev.some((p) => p.id === c.id)
        );
        return [...prev, ...newOnes];
      });
      loadingRef.current = false;
    }
  }, [data]);

  useEffect(() => {
    if (!loaderRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadingRef.current) {
          loadingRef.current = true;
          setPage((p) => p + 1);
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0,
      }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage]);

  return (
    <div className="flex flex-col space-y-3">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}

      {hasNextPage && (
        <div
          ref={loaderRef}
          className="h-10 flex justify-center items-center text-gray-500 text-sm"
        >
          {isFetching && <p>Loading more…</p>}
        </div>
      )}
    </div>
  );
}

export default Commentpost