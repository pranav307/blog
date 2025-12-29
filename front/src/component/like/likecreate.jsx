
import { useGetlikeQuery, usePostlikesQuery } from "../../store/like";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function Likecreate(id){
   const [postlike,error,isLoading] =usePostlikesQuery()
   const {data,error:err}=useGetlikeQuery(id)
   const users =JSON.parse(localStorage.getItem("user"))
 const handlelike=async()=>{
    try {
        await postlike(id)
        console.log("user like")
    } catch (error) {
        console.log(error?.data.message)
    }
 }
return (
    <button onClick={handlelike}>
        {data.user ===users.id ? (<FaHeart color="red" size={22} /> ) :( <FaRegHeart size={22} />)}
    </button>
) 
  
}

export default Likecreate