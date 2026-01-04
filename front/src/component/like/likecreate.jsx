import { useGetlikeQuery, usePostlikesMutation } from "../../store/like";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function Likecreate({id}) {
  const [postlike, { isLoading }] = usePostlikesMutation();
  const { data: likes} = useGetlikeQuery({postId:id});
  const users = JSON.parse(localStorage.getItem("user")) || null;
   console.log(likes,"dekh le")
  // check if current user already liked
const hasLiked = Boolean(likes?.liked);
if (!users) return;
  const handlelike = async () => {
    if (!users) {
      return alert("login first");
    }
    try {
      await postlike({postId:id});
    } catch (error) {
      console.log(error?.data?.message);
    }
  };

  return (
    <button
      onClick={handlelike}
      disabled={isLoading}
      className={`
        flex items-center justify-center
        w-10 h-10 rounded-full
        transition-all duration-200 ease-out
        ${hasLiked 
          ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md"
          : "bg-gray-100 hover:bg-gray-200 text-gray-600"
        }
        hover:scale-110 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {hasLiked ? (
        <FaHeart className="text-white" size={18} />
      ) : (
        <FaRegHeart size={18} />
      )}
    </button>
  );
}

export default Likecreate;
