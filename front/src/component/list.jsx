import { useState } from "react";
import { useGetitemQuery } from "../store/home";
import Commentpost from "./comment/commentpost";
import Postcomment from "./comment/postcomment";
import Likecreate from "./like/likecreate";
import { useNavigate } from "react-router-dom";

function Postlist() {
  const [openCommentId, setOpenCommentId] = useState(null);
  const { data, error, isLoading } = useGetitemQuery();
  const navigate =useNavigate()
  if (isLoading) {
    return <p>...isloading</p>;
  }

  return (
    <div className="grid grid-cols-4 mt-4 gap-4 items-start">
      {data &&
        data.map(item => (
          <div
            key={item.id}
            className="bg-gray-300 flex flex-col m-4 p-4 rounded"
          >
            <h1 className="font-semibold">{item.title}</h1>

            <div className="flex flex-col gap-2 mt-2">
              <Likecreate id={item.id} />
               {item.like_count}
              <button
                onClick={() =>
                  setOpenCommentId(prev =>
                    prev === item.id ? null : item.id
                  )
                }
                className="text-sm text-blue-600 hover:underline self-start"
              >
                {openCommentId === item.id
                  ? "Hide comments"
                  : "Show comments"}
              </button>

              {openCommentId === item.id && (
                <Commentpost id={item.id} />
              )}
            </div>

            <Postcomment id={item.id} />
            <button onClick={()=>navigate(`/a/${item.id}`)}>Details</button>
          </div>
        ))}

      {error?.data?.message && <p>{error.data.message}</p>}
    </div>
  );
}

export default Postlist;
