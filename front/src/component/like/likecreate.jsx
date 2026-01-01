
import { useGetlikeQuery, usePostlikesMutation} from "../../store/like";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function Likecreate(id){
   const [postlike,error,isLoading] =usePostlikesMutation()
   const {data:likes=[],error:err}=useGetlikeQuery(id)
   const users =JSON.parse(localStorage.getItem("user")) || null
     // check if current user already liked
  const hasLiked = users ? likes.some(l => l.user === users.id) : false;
 const handlelike=async()=>{
    if(!users){
        return alert("login first")
    } ;
    try {
        await postlike(id)
        console.log("user like")
    } catch (error) {
        console.log(error?.data.message)
    }
 }
return (
    <button onClick={handlelike}>
        {hasLiked ? (<FaHeart color="red" size={22} /> ) :( <FaRegHeart size={22} />)}
    </button>
) 
  
}

export default Likecreate