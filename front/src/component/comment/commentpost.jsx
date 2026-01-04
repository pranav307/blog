import { useEffect, useRef, useState } from "react";
import { useGetcommentQuery } from "../../store/comment";
import CommentItem from "./recusivenested";

function Commentpost({ id, parent_id }) {
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);
  const loadingRef = useRef(false);

  const { data, isFetching } = useGetcommentQuery({ id, page, parent_id });

  const comments = data?.results ?? [];
  const hasNextPage = Boolean(data?.next);

  useEffect(() => {
    loadingRef.current = false;
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [id, parent_id]);

  useEffect(() => {
    if (!loaderRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadingRef.current) {
          loadingRef.current = true;
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "300px" }
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

export default Commentpost;
