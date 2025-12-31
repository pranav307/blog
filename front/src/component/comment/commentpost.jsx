
import { useGetcommentQuery } from "../../store/comment";
import CommentItem from "./recusivenested";

function Commentpost({id,parent_id=null}){
    
   const {data,error,isLoading} =useGetcommentQuery({id,parent_id}) 

    // const handlenest=(id,parent_id) =>{
        
    //    try {
    //      const {data:d,error:err} =useGetcommentQuery(id,parent_id) cannot call hook inside function
    //      console.log("rrr",d)
    //      return d,err
    //    } catch (e) {
    //       console.log(e,"check karlo sahi hai")
    //    }
    // }  
     if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error?.data?.message}</p>;
   return (
    <div>
     {data.map((item)=>(
        <div key={item.id}>
           <CommentItem key={item.id} comment={item} />
          
        </div>
     ))}

    {error && <p>{error?.data?.message}</p> }
    </div>
   )
}

export default Commentpost
