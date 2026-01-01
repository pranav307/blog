import { useEffect, useRef, useState } from "react"
import { useGetcommentQuery } from "../../store/comment"
import CommentItem from "./recusivenested"

function Commentpost({ id }) {
  const [page, setPage] = useState(1)
  const loaderRef = useRef(null)

  const { data, isFetching } = useGetcommentQuery({ id, page })

  const comments = data?.results ?? []
  const hasNextPage = Boolean(data?.next)

  // IntersectionObserver logic
  useEffect(() => {
    if (!loaderRef.current || !hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting && !isFetching) {
          setPage((p) => p + 1)
        }
      },
      {
        root: null,       // viewport
        rootMargin: "200px",
        threshold: 0,
      }
    )

    observer.observe(loaderRef.current)

    return () => observer.disconnect()
  }, [hasNextPage, isFetching])

  return (
    <div>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}

      {/*  Observer target */}
      {hasNextPage && (
        <div ref={loaderRef} style={{ height: "40px" }}>
          {isFetching && <p>Loading more comments...</p>}
        </div>
      )}
    </div>
  )
}

export default Commentpost  